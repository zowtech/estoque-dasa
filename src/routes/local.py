from flask import Blueprint, jsonify, request
from src.models import db, Local
from datetime import datetime

local_bp = Blueprint('local', __name__)

@local_bp.route('/', methods=['GET'])
def get_locais():
    """Retorna todos os locais/banheiros"""
    try:
        locais = Local.query.all()
        locais_data = []
        for local in locais:
            locais_data.append({
                'id': local.id,
                'nome': local.nome,
                'andar': local.andar,
                'tipo': local.tipo,
                'capacidade': local.capacidade,
                'status': local.status
            })
        return jsonify(locais_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@local_bp.route('/', methods=['POST'])
def create_local():
    """Cria um novo local/banheiro"""
    try:
        data = request.get_json()
        
        new_local = Local(
            nome=data['nome'],
            andar=data.get('andar', 1),
            tipo=data.get('tipo', 'Misto'),
            capacidade=data.get('capacidade', 10),
            status=data.get('status', 'Ativo')
        )
        
        db.session.add(new_local)
        db.session.commit()
        
        return jsonify({'message': 'Local criado com sucesso', 'id': new_local.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

