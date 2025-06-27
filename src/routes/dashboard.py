from flask import Blueprint, jsonify, request
from src.models import db, Item, Movimentacao, Local
from datetime import datetime, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retorna os KPIs do dashboard baseados em dados reais, incluindo desperdício"""
    try:
        # Consumo total (últimos 30 dias) - dados reais
        data_inicio = datetime.now() - timedelta(days=30)
        consumo_total = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Produtos com estoque baixo - dados reais
        produtos_estoque_baixo = Item.query.filter(
            Item.quantidade <= 5  # Ajuste conforme sua regra de estoque baixo
        ).count()
        
        # Alertas críticos (estoque zerado) - dados reais
        alertas_criticos = Item.query.filter(Item.quantidade == 0).count()
        
        # Redução de desperdício - calculado baseado em movimentações
        total_entradas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'entrada',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        total_saidas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        total_desperdicio = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'desperdicio',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Calcula redução de desperdício (se houver dados)
        if total_entradas > 0:
            reducao_desperdicio = round(((total_entradas - total_saidas - total_desperdicio) / total_entradas) * 100, 1)
            percentual_desperdicio = round((total_desperdicio / total_entradas) * 100, 1)
        else:
            reducao_desperdicio = 0
            percentual_desperdicio = 0
        
        # Produto mais desperdiçado
        produto_mais_desperdicado = db.session.query(
            Item.nome, func.sum(Movimentacao.quantidade).label('total_desperdicio')
        ).join(Movimentacao).filter(
            Movimentacao.tipo == 'desperdicio',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(Item.id).order_by(
            func.sum(Movimentacao.quantidade).desc()
        ).first()
        
        # Local com maior desperdício
        local_mais_desperdicio = db.session.query(
            Local.descricao, func.sum(Movimentacao.quantidade).label('total_desperdicio')
        ).join(Movimentacao, Movimentacao.local_destino_id == Local.id).filter(
            Movimentacao.tipo == 'desperdicio',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(Local.id).order_by(
            func.sum(Movimentacao.quantidade).desc()
        ).first()
        
        return jsonify({
            'consumo_total': int(consumo_total),
            'reducao_desperdicio': reducao_desperdicio,
            'percentual_desperdicio': percentual_desperdicio,
            'total_desperdicio': int(total_desperdicio),
            'produtos_estoque_baixo': produtos_estoque_baixo,
            'alertas_criticos': alertas_criticos,
            'produto_mais_desperdicado': produto_mais_desperdicado[0] if produto_mais_desperdicado else None,
            'local_mais_desperdicio': local_mais_desperdicio[0] if local_mais_desperdicio else None
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

@dashboard_bp.route('/ranking-desperdicio-banheiros', methods=['GET'])
def get_ranking_desperdicio_banheiros():
    """Retorna o ranking de desperdício por banheiro/local"""
    try:
        data_inicio = datetime.now() - timedelta(days=30)
        locais = Local.query.all()
        ranking_data = []
        for local in locais:
            desperdicio = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.tipo == 'desperdicio',
                Movimentacao.local_destino_id == local.id,
                Movimentacao.data_movimentacao >= data_inicio
            ).scalar() or 0
            ranking_data.append({
                'id': local.id,
                'descricao': local.descricao,
                'andar': local.andar,
                'tipo_banheiro': local.tipo_banheiro.lower(),
                'desperdicio': int(desperdicio)
            })
        ranking_data.sort(key=lambda x: x['desperdicio'], reverse=True)
        return jsonify(ranking_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/produtos-mais-desperdicados', methods=['GET'])
def get_produtos_mais_desperdicados():
    """Retorna os produtos mais desperdiçados"""
    try:
        data_inicio = datetime.now() - timedelta(days=30)
        produtos_desperdicados = db.session.query(
            Item.nome,
            func.sum(Movimentacao.quantidade).label('total_desperdicio')
        ).join(Movimentacao).filter(
            Movimentacao.tipo == 'desperdicio',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(Item.id).order_by(
            func.sum(Movimentacao.quantidade).desc()
        ).limit(5).all()
        produtos_data = []
        for produto in produtos_desperdicados:
            produtos_data.append({
                'nome': produto.nome,
                'desperdicio': int(produto.total_desperdicio)
            })
        return jsonify(produtos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/consumo-e-desperdicio-por-periodo', methods=['GET'])
def get_consumo_e_desperdicio_por_periodo():
    """Retorna dados de consumo e desperdício por período para gráficos"""
    try:
        periodo = request.args.get('periodo', '30')  # dias
        data_inicio = datetime.now() - timedelta(days=int(periodo))
        # Consumo por dia
        consumo_diario = db.session.query(
            func.date(Movimentacao.data_movimentacao).label('data'),
            func.sum(Movimentacao.quantidade).label('total')
        ).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(func.date(Movimentacao.data_movimentacao)).all()
        # Desperdício por dia
        desperdicio_diario = db.session.query(
            func.date(Movimentacao.data_movimentacao).label('data'),
            func.sum(Movimentacao.quantidade).label('total')
        ).filter(
            Movimentacao.tipo == 'desperdicio',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(func.date(Movimentacao.data_movimentacao)).all()
        dados_grafico = []
        datas = set([r.data for r in consumo_diario] + [r.data for r in desperdicio_diario])
        for data in sorted(datas):
            consumo = next((int(r.total) for r in consumo_diario if r.data == data), 0)
            desperdicio = next((int(r.total) for r in desperdicio_diario if r.data == data), 0)
            dados_grafico.append({
                'data': data.strftime('%Y-%m-%d'),
                'consumo': consumo,
                'desperdicio': desperdicio
            })
        return jsonify(dados_grafico)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

