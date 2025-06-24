from flask import Blueprint, jsonify, request
from src.models import db, Evento
from datetime import datetime

eventos_bp = Blueprint('eventos', __name__)

@eventos_bp.route('/', methods=['GET'])
def get_eventos():
    """Retorna eventos reais do banco de dados"""
    try:
        # Busca eventos reais do banco
        eventos = Evento.query.order_by(Evento.data_evento.desc()).all()
        
        eventos_data = []
        for evento in eventos:
            eventos_data.append({
                'id': evento.id,
                'titulo': evento.titulo,
                'descricao': evento.descricao,
                'data_evento': evento.data_evento.isoformat(),
                'tipo': evento.tipo,
                'prioridade': evento.prioridade,
                'status': evento.status,
                'local_id': evento.local_id
            })
        
        return jsonify(eventos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/', methods=['POST'])
def create_evento():
    """Cria um novo evento no banco de dados"""
    try:
        data = request.get_json()
        
        # Converte string de data para datetime
        data_evento = datetime.fromisoformat(data['data_evento'].replace('Z', '+00:00'))
        
        novo_evento = Evento(
            titulo=data['titulo'],
            descricao=data.get('descricao', ''),
            data_evento=data_evento,
            tipo=data.get('tipo', 'Geral'),
            prioridade=data.get('prioridade', 'Normal'),
            status=data.get('status', 'Pendente'),
            local_id=data.get('local_id')
        )
        
        db.session.add(novo_evento)
        db.session.commit()
        
        return jsonify({
            'message': 'Evento criado com sucesso',
            'id': novo_evento.id,
            'evento': {
                'id': novo_evento.id,
                'titulo': novo_evento.titulo,
                'descricao': novo_evento.descricao,
                'data_evento': novo_evento.data_evento.isoformat(),
                'tipo': novo_evento.tipo,
                'prioridade': novo_evento.prioridade,
                'status': novo_evento.status
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/<int:evento_id>', methods=['PUT'])
def update_evento(evento_id):
    """Atualiza um evento existente"""
    try:
        evento = Evento.query.get_or_404(evento_id)
        data = request.get_json()
        
        evento.titulo = data.get('titulo', evento.titulo)
        evento.descricao = data.get('descricao', evento.descricao)
        
        if 'data_evento' in data:
            evento.data_evento = datetime.fromisoformat(data['data_evento'].replace('Z', '+00:00'))
        
        evento.tipo = data.get('tipo', evento.tipo)
        evento.prioridade = data.get('prioridade', evento.prioridade)
        evento.status = data.get('status', evento.status)
        evento.local_id = data.get('local_id', evento.local_id)
        
        db.session.commit()
        
        return jsonify({'message': 'Evento atualizado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/<int:evento_id>', methods=['DELETE'])
def delete_evento(evento_id):
    """Remove um evento"""
    try:
        evento = Evento.query.get_or_404(evento_id)
        db.session.delete(evento)
        db.session.commit()
        
        return jsonify({'message': 'Evento removido com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/por-periodo', methods=['GET'])
def get_eventos_por_periodo():
    """Retorna eventos filtrados por período"""
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = Evento.query
        
        if data_inicio:
            data_inicio_dt = datetime.fromisoformat(data_inicio)
            query = query.filter(Evento.data_evento >= data_inicio_dt)
        
        if data_fim:
            data_fim_dt = datetime.fromisoformat(data_fim)
            query = query.filter(Evento.data_evento <= data_fim_dt)
        
        eventos = query.order_by(Evento.data_evento.desc()).all()
        
        eventos_data = []
        for evento in eventos:
            eventos_data.append({
                'id': evento.id,
                'titulo': evento.titulo,
                'descricao': evento.descricao,
                'data_evento': evento.data_evento.isoformat(),
                'tipo': evento.tipo,
                'prioridade': evento.prioridade,
                'status': evento.status
            })
        
        return jsonify(eventos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

