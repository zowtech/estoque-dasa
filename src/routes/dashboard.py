from flask import Blueprint, jsonify
from src.models import db, Item, Movimentacao, Local
from datetime import datetime, timedelta
import random

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retorna os KPIs do dashboard"""
    try:
        # Consumo total (últimos 30 dias)
        data_inicio = datetime.now() - timedelta(days=30)
        consumo_total = db.session.query(db.func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Produtos com estoque baixo
        produtos_estoque_baixo = Item.query.filter(
            Item.quantidade_atual <= Item.quantidade_minima
        ).count()
        
        # Alertas críticos (estoque zerado)
        alertas_criticos = Item.query.filter(Item.quantidade_atual == 0).count()
        
        # Redução de desperdício (simulado)
        reducao_desperdicio = 15.2
        
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
    """Retorna o ranking de consumo por banheiro"""
    try:
        # Dados simulados para demonstração
        ranking_data = [
            {'nome': 'Banheiro Masculino - 1º Andar', 'consumo': 245, 'tipo': 'masculino'},
            {'nome': 'Banheiro Feminino - 2º Andar', 'consumo': 198, 'tipo': 'feminino'},
            {'nome': 'Banheiro Masculino - 3º Andar', 'consumo': 187, 'tipo': 'masculino'},
            {'nome': 'Banheiro Feminino - 1º Andar', 'consumo': 156, 'tipo': 'feminino'},
            {'nome': 'Banheiro Masculino - 2º Andar', 'consumo': 134, 'tipo': 'masculino'}
        ]
        
        return jsonify(ranking_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/produtos-mais-consumidos', methods=['GET'])
def get_produtos_mais_consumidos():
    """Retorna os produtos mais consumidos"""
    try:
        # Consulta real dos produtos mais consumidos
        produtos_consumidos = db.session.query(
            Item.nome,
            db.func.sum(Movimentacao.quantidade).label('total_consumido')
        ).join(Movimentacao).filter(
            Movimentacao.tipo == 'saida'
        ).group_by(Item.id).order_by(
            db.func.sum(Movimentacao.quantidade).desc()
        ).limit(5).all()
        
        produtos_data = []
        for produto in produtos_consumidos:
            produtos_data.append({
                'nome': produto.nome,
                'consumo': int(produto.total_consumido)
            })
        
        # Se não houver dados, retorna dados simulados
        if not produtos_data:
            produtos_data = [
                {'nome': 'Papel Higiênico', 'consumo': 450},
                {'nome': 'Sabonete Líquido', 'consumo': 320},
                {'nome': 'Papel Toalha', 'consumo': 280},
                {'nome': 'Álcool em Gel', 'consumo': 210},
                {'nome': 'Desinfetante', 'consumo': 180}
            ]
        
        return jsonify(produtos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

