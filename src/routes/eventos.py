from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

eventos_bp = Blueprint('eventos', __name__)

@eventos_bp.route('/', methods=['GET'])
def get_eventos():
    """Retorna eventos do sistema"""
    try:
        # Dados simulados de eventos
        eventos_data = [
            {
                'id': 1,
                'tipo': 'Estoque Baixo',
                'descricao': 'Papel higiênico com estoque baixo no 2º andar',
                'data': (datetime.now() - timedelta(hours=2)).isoformat(),
                'prioridade': 'Alta'
            },
            {
                'id': 2,
                'tipo': 'Reposição',
                'descricao': 'Sabonete líquido reposto no banheiro feminino',
                'data': (datetime.now() - timedelta(hours=5)).isoformat(),
                'prioridade': 'Normal'
            },
            {
                'id': 3,
                'tipo': 'Manutenção',
                'descricao': 'Limpeza programada para o 3º andar',
                'data': (datetime.now() - timedelta(days=1)).isoformat(),
                'prioridade': 'Baixa'
            }
        ]
        
        return jsonify(eventos_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/', methods=['POST'])
def create_evento():
    """Cria um novo evento"""
    try:
        data = request.get_json()
        
        # Simula criação de evento
        novo_evento = {
            'id': random.randint(100, 999),
            'tipo': data.get('tipo', 'Geral'),
            'descricao': data.get('descricao', ''),
            'data': datetime.now().isoformat(),
            'prioridade': data.get('prioridade', 'Normal')
        }
        
        return jsonify({'message': 'Evento criado com sucesso', 'evento': novo_evento}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

