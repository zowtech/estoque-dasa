from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

relatorios_bp = Blueprint('relatorios', __name__)

@relatorios_bp.route('/consumo', methods=['GET'])
def get_relatorio_consumo():
    """Retorna dados de consumo para relatórios"""
    try:
        periodo = request.args.get('periodo', '30')
        
        # Dados simulados de consumo por andar
        consumo_por_andar = [
            {'andar': '1º Andar', 'masculino': 245, 'feminino': 198, 'total': 443},
            {'andar': '2º Andar', 'masculino': 187, 'feminino': 234, 'total': 421},
            {'andar': '3º Andar', 'masculino': 156, 'feminino': 189, 'total': 345},
            {'andar': '4º Andar', 'masculino': 134, 'feminino': 167, 'total': 301},
            {'andar': '5º Andar', 'masculino': 112, 'feminino': 145, 'total': 257}
        ]
        
        # Dados de consumo por produto
        consumo_por_produto = [
            {'produto': 'Papel Higiênico', 'quantidade': 450, 'unidade': 'rolos'},
            {'produto': 'Sabonete Líquido', 'quantidade': 320, 'unidade': 'ml'},
            {'produto': 'Papel Toalha', 'quantidade': 280, 'unidade': 'folhas'},
            {'produto': 'Álcool em Gel', 'quantidade': 210, 'unidade': 'ml'},
            {'produto': 'Desinfetante', 'quantidade': 180, 'unidade': 'ml'}
        ]
        
        return jsonify({
            'consumo_por_andar': consumo_por_andar,
            'consumo_por_produto': consumo_por_produto,
            'periodo': f'Últimos {periodo} dias',
            'total_geral': sum(item['total'] for item in consumo_por_andar)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/desperdicio', methods=['GET'])
def get_relatorio_desperdicio():
    """Retorna dados de desperdício para relatórios"""
    try:
        # Dados simulados de desperdício
        desperdicio_por_andar = [
            {'andar': '1º Andar', 'desperdicio': 9.7, 'economia_potencial': 180},
            {'andar': '2º Andar', 'desperdicio': 14.2, 'economia_potencial': 250},
            {'andar': '3º Andar', 'desperdicio': 18.3, 'economia_potencial': 320},
            {'andar': '4º Andar', 'desperdicio': 15.5, 'economia_potencial': 280},
            {'andar': '5º Andar', 'desperdicio': 20.6, 'economia_potencial': 350}
        ]
        
        desperdicio_por_produto = [
            {'produto': 'Papel Higiênico', 'desperdicio': 22.5, 'valor_perdido': 450},
            {'produto': 'Papel Toalha', 'desperdicio': 18.3, 'valor_perdido': 320},
            {'produto': 'Sabonete Líquido', 'desperdicio': 12.1, 'valor_perdido': 180},
            {'produto': 'Álcool em Gel', 'desperdicio': 8.7, 'valor_perdido': 120},
            {'produto': 'Desinfetante', 'desperdicio': 15.2, 'valor_perdido': 180}
        ]
        
        return jsonify({
            'desperdicio_por_andar': desperdicio_por_andar,
            'desperdicio_por_produto': desperdicio_por_produto,
            'desperdicio_total': 15.2,
            'valor_total_perdido': 1250,
            'economia_potencial_total': 950
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/comparativo', methods=['GET'])
def get_relatorio_comparativo():
    """Retorna dados comparativos para relatórios"""
    try:
        periodo_atual = request.args.get('periodo_atual', '30')
        periodo_anterior = request.args.get('periodo_anterior', '30')
        
        # Dados simulados comparativos
        comparativo_consumo = [
            {'categoria': 'Papel Higiênico', 'atual': 450, 'anterior': 520, 'variacao': -13.5},
            {'categoria': 'Sabonete Líquido', 'atual': 320, 'anterior': 280, 'variacao': 14.3},
            {'categoria': 'Papel Toalha', 'atual': 280, 'anterior': 310, 'variacao': -9.7},
            {'categoria': 'Álcool em Gel', 'atual': 210, 'anterior': 190, 'variacao': 10.5},
            {'categoria': 'Desinfetante', 'atual': 180, 'anterior': 200, 'variacao': -10.0}
        ]
        
        comparativo_banheiros = [
            {'banheiro': 'Masculino', 'atual': 734, 'anterior': 820, 'variacao': -10.5},
            {'banheiro': 'Feminino', 'atual': 933, 'anterior': 880, 'variacao': 6.0}
        ]
        
        return jsonify({
            'comparativo_consumo': comparativo_consumo,
            'comparativo_banheiros': comparativo_banheiros,
            'periodo_atual': f'Últimos {periodo_atual} dias',
            'periodo_anterior': f'{periodo_anterior} dias anteriores',
            'tendencia_geral': 'Redução de 5.2% no consumo total'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

