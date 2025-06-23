from flask import Blueprint, jsonify, request
from src.models import db, Movimentacao, Item
from datetime import datetime

movimentacao_bp = Blueprint('movimentacao', __name__)

@movimentacao_bp.route('/', methods=['GET'])
def get_movimentacoes():
    """Retorna todas as movimentações"""
    try:
        movimentacoes = Movimentacao.query.order_by(Movimentacao.data_movimentacao.desc()).all()
        movimentacoes_data = []
        for mov in movimentacoes:
            movimentacoes_data.append({
                'id': mov.id,
                'item_id': mov.item_id,
                'item_nome': mov.item.nome if mov.item else 'Item não encontrado',
                'tipo': mov.tipo,
                'quantidade': mov.quantidade,
                'data_movimentacao': mov.data_movimentacao.isoformat(),
                'observacoes': mov.observacoes
            })
        return jsonify(movimentacoes_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movimentacao_bp.route('/', methods=['POST'])
def create_movimentacao():
    """Registra uma nova movimentação"""
    try:
        data = request.get_json()
        
        # Busca o item
        item = Item.query.get_or_404(data['item_id'])
        
        # Cria a movimentação
        new_movimentacao = Movimentacao(
            item_id=data['item_id'],
            tipo=data['tipo'],  # 'entrada' ou 'saida'
            quantidade=data['quantidade'],
            observacoes=data.get('observacoes', '')
        )
        
        # Atualiza a quantidade do item
        if data['tipo'] == 'entrada':
            item.quantidade_atual += data['quantidade']
        elif data['tipo'] == 'saida':
            if item.quantidade_atual >= data['quantidade']:
                item.quantidade_atual -= data['quantidade']
            else:
                return jsonify({'error': 'Quantidade insuficiente em estoque'}), 400
        
        db.session.add(new_movimentacao)
        db.session.commit()
        
        return jsonify({'message': 'Movimentação registrada com sucesso', 'id': new_movimentacao.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

