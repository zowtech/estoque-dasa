from flask import Blueprint, jsonify, request
from src.models import db, Item, Movimentacao, Local
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retorna os KPIs do dashboard baseados em dados reais"""
    try:
        # Consumo total (últimos 30 dias) - dados reais
        data_inicio = datetime.now() - timedelta(days=30)
        consumo_total = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Produtos com estoque baixo - dados reais
        produtos_estoque_baixo = Item.query.filter(
            Item.quantidade_atual <= Item.quantidade_minima
        ).count()
        
        # Alertas críticos (estoque zerado) - dados reais
        alertas_criticos = Item.query.filter(Item.quantidade_atual == 0).count()
        
        # Redução de desperdício - calculado baseado em movimentações
        total_entradas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'entrada',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        total_saidas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Calcula redução de desperdício (se houver dados)
        if total_entradas > 0:
            reducao_desperdicio = round(((total_entradas - total_saidas) / total_entradas) * 100, 1)
        else:
            reducao_desperdicio = 0
        
        return jsonify({
            'consumo_total': int(consumo_total),
            'reducao_desperdicio': reducao_desperdicio,
            'produtos_estoque_baixo': produtos_estoque_baixo,
            'alertas_criticos': alertas_criticos
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/ranking-banheiros', methods=['GET'])
def get_ranking_banheiros():
    """Retorna o ranking de consumo por banheiro baseado em dados reais"""
    try:
        data_inicio = datetime.now() - timedelta(days=30)
        locais = Local.query.all()
        ranking_data = []
        for local in locais:
            # Consumo real por local (somando todas as movimentações de saída para este local)
            consumo = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.tipo == 'saida',
                Movimentacao.local_destino_id == local.id,
                Movimentacao.data_movimentacao >= data_inicio
            ).scalar() or 0
            ranking_data.append({
                'id': local.id,
                'descricao': local.descricao,
                'andar': local.andar,
                'tipo_banheiro': local.tipo_banheiro.lower(),
                'consumo': int(consumo)
            })
        # Ordena por consumo (decrescente)
        ranking_data.sort(key=lambda x: x['consumo'], reverse=True)
        return jsonify(ranking_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/produtos-mais-consumidos', methods=['GET'])
def get_produtos_mais_consumidos():
    """Retorna os produtos mais consumidos baseado em dados reais"""
    try:
        # Consulta real dos produtos mais consumidos (últimos 30 dias)
        data_inicio = datetime.now() - timedelta(days=30)
        
        produtos_consumidos = db.session.query(
            Item.nome,
            func.sum(Movimentacao.quantidade).label('total_consumido')
        ).join(Movimentacao).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(Item.id).order_by(
            func.sum(Movimentacao.quantidade).desc()
        ).limit(5).all()
        
        produtos_data = []
        for produto in produtos_consumidos:
            produtos_data.append({
                'nome': produto.nome,
                'consumo': int(produto.total_consumido)
            })
        
        return jsonify(produtos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/consumo-por-periodo', methods=['GET'])
def get_consumo_por_periodo():
    """Retorna dados de consumo por período para gráficos"""
    try:
        periodo = request.args.get('periodo', '30')  # dias
        data_inicio = datetime.now() - timedelta(days=int(periodo))
        
        # Consulta consumo por dia
        consumo_diario = db.session.query(
            func.date(Movimentacao.data_movimentacao).label('data'),
            func.sum(Movimentacao.quantidade).label('total')
        ).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(func.date(Movimentacao.data_movimentacao)).all()
        
        dados_grafico = []
        for registro in consumo_diario:
            dados_grafico.append({
                'data': registro.data.strftime('%Y-%m-%d'),
                'consumo': int(registro.total)
            })
        
        return jsonify(dados_grafico)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

