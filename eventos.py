from flask import Blueprint, jsonify, request
from src.models import db, Evento
from datetime import datetime
import json

eventos_bp = Blueprint('eventos', __name__)

@eventos_bp.route('/', methods=['GET'])
def get_eventos():
    """Retorna todos os eventos cadastrados"""
    try:
        eventos = Evento.query.all()
        return jsonify([evento.to_dict() for evento in eventos]), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@eventos_bp.route('/<int:evento_id>', methods=['GET'])
def get_evento(evento_id):
    """Retorna um evento específico pelo ID"""
    try:
        evento = Evento.query.get(evento_id)
        if not evento:
            return jsonify({"erro": "Evento não encontrado"}), 404
        return jsonify(evento.to_dict()), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@eventos_bp.route('/', methods=['POST'])
def create_evento():
    """Cria um novo evento"""
    try:
        data = request.json
        
        # Validar dados obrigatórios
        if not data.get('titulo') or not data.get('data'):
            return jsonify({"erro": "Título e data são obrigatórios"}), 400
        
        # Converter string de data para objeto datetime
        data_evento = datetime.strptime(data.get('data'), '%Y-%m-%d')
        
        novo_evento = Evento(
            titulo=data.get('titulo'),
            descricao=data.get('descricao'),
            data=data_evento,
            tipo=data.get('tipo', 'outro')
        )
        
        db.session.add(novo_evento)
        db.session.commit()
        
        return jsonify(novo_evento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@eventos_bp.route('/<int:evento_id>', methods=['PUT'])
def update_evento(evento_id):
    """Atualiza um evento existente"""
    try:
        evento = Evento.query.get(evento_id)
        if not evento:
            return jsonify({"erro": "Evento não encontrado"}), 404
        
        data = request.json
        
        if 'titulo' in data:
            evento.titulo = data['titulo']
        
        if 'descricao' in data:
            evento.descricao = data['descricao']
        
        if 'data' in data:
            evento.data = datetime.strptime(data['data'], '%Y-%m-%d')
        
        if 'tipo' in data:
            evento.tipo = data['tipo']
        
        db.session.commit()
        
        return jsonify(evento.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@eventos_bp.route('/<int:evento_id>', methods=['DELETE'])
def delete_evento(evento_id):
    """Remove um evento existente"""
    try:
        evento = Evento.query.get(evento_id)
        if not evento:
            return jsonify({"erro": "Evento não encontrado"}), 404
        
        db.session.delete(evento)
        db.session.commit()
        
        return jsonify({"mensagem": "Evento removido com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 500

@eventos_bp.route('/por-periodo', methods=['GET'])
def get_eventos_por_periodo():
    """Retorna eventos em um período específico"""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        if not data_inicio or not data_fim:
            return jsonify({"erro": "Data de início e fim são obrigatórias"}), 400
        
        # Converter strings para objetos datetime
        data_inicio_dt = datetime.strptime(data_inicio, '%Y-%m-%d')
        data_fim_dt = datetime.strptime(data_fim, '%Y-%m-%d')
        
        # Buscar eventos no período
        eventos = Evento.query.filter(
            Evento.data >= data_inicio_dt,
            Evento.data <= data_fim_dt
        ).all()
        
        return jsonify([evento.to_dict() for evento in eventos]), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
