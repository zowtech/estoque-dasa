from flask import Blueprint, jsonify, request
from src.models import db, Item, Movimentacao, Local
from datetime import datetime, timedelta
import random

item_bp = Blueprint('item', __name__)

@item_bp.route('/', methods=['GET'])
def get_items():
    """Retorna todos os itens do estoque"""
    try:
        items = Item.query.all()
        items_data = []
        for item in items:
            items_data.append({
                'id': item.id,
                'nome': item.nome,
                'categoria': item.categoria,
                'unidade': item.unidade,
                'quantidade_atual': item.quantidade_atual,
                'quantidade_minima': item.quantidade_minima,
                'preco_unitario': float(item.preco_unitario) if item.preco_unitario else 0,
                'localizacao': item.localizacao,
                'status': 'Crítico' if item.quantidade_atual <= item.quantidade_minima else 'Normal'
            })
        return jsonify(items_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@item_bp.route('/', methods=['POST'])
def create_item():
    """Cria um novo item no estoque"""
    try:
        data = request.get_json()
        
        new_item = Item(
            nome=data['nome'],
            categoria=data.get('categoria', 'Geral'),
            unidade=data.get('unidade', 'un'),
            quantidade_atual=data.get('quantidade_atual', 0),
            quantidade_minima=data.get('quantidade_minima', 10),
            preco_unitario=data.get('preco_unitario', 0),
            localizacao=data.get('localizacao', 'Estoque Principal')
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({'message': 'Item criado com sucesso', 'id': new_item.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@item_bp.route('/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """Atualiza um item existente"""
    try:
        item = Item.query.get_or_404(item_id)
        data = request.get_json()
        
        item.nome = data.get('nome', item.nome)
        item.categoria = data.get('categoria', item.categoria)
        item.unidade = data.get('unidade', item.unidade)
        item.quantidade_atual = data.get('quantidade_atual', item.quantidade_atual)
        item.quantidade_minima = data.get('quantidade_minima', item.quantidade_minima)
        item.preco_unitario = data.get('preco_unitario', item.preco_unitario)
        item.localizacao = data.get('localizacao', item.localizacao)
        
        db.session.commit()
        
        return jsonify({'message': 'Item atualizado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@item_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Remove um item do estoque"""
    try:
        item = Item.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Item removido com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

