from flask import Blueprint, jsonify, request
import datetime
import random

relatorios_bp = Blueprint('relatorios', __name__)

# Dados fictícios para os relatórios
dados_relatorios = {
    "consumo": {
        "porAndar": [
            {"nome": "Andar 5", "valor": 356, "percentual": 28},
            {"nome": "Andar 3", "valor": 310, "percentual": 24},
            {"nome": "Andar 1", "valor": 160, "percentual": 13},
            {"nome": "Andar 4", "valor": 245, "percentual": 19},
            {"nome": "Andar 2", "valor": 177, "percentual": 16}
        ],
        "porTipo": [
            {"nome": "Feminino", "valor": 653, "percentual": 52},
            {"nome": "Masculino", "valor": 595, "percentual": 48}
        ],
        "porProduto": [
            {
                "nome": "Papel Higiênico",
                "total": 580,
                "masculino": 270,
                "feminino": 310,
                "mediaPorAndar": 116,
                "tendencia": 5.2,
                "tendenciaPositiva": True
            },
            {
                "nome": "Sabonete Líquido",
                "total": 320,
                "masculino": 150,
                "feminino": 170,
                "mediaPorAndar": 64,
                "tendencia": 3.8,
                "tendenciaPositiva": True
            },
            {
                "nome": "Papel Toalha",
                "total": 240,
                "masculino": 120,
                "feminino": 120,
                "mediaPorAndar": 48,
                "tendencia": -1.5,
                "tendenciaPositiva": False
            },
            {
                "nome": "Álcool em Gel",
                "total": 80,
                "masculino": 40,
                "feminino": 40,
                "mediaPorAndar": 16,
                "tendencia": 0,
                "tendenciaPositiva": None
            },
            {
                "nome": "Desinfetante",
                "total": 28,
                "masculino": 15,
                "feminino": 13,
                "mediaPorAndar": 5.6,
                "tendencia": -2.3,
                "tendenciaPositiva": False
            }
        ],
        "tendencia": {
            "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            "datasets": [
                {"nome": "Papel Higiênico", "valores": [520, 540, 560, 550, 570, 580]},
                {"nome": "Sabonete Líquido", "valores": [300, 310, 305, 315, 310, 320]},
                {"nome": "Papel Toalha", "valores": [250, 245, 240, 235, 230, 240]},
                {"nome": "Álcool em Gel", "valores": [80, 80, 80, 80, 80, 80]},
                {"nome": "Desinfetante", "valores": [30, 29, 28, 27, 28, 28]}
            ]
        }
    },
    "desperdicio": {
        "porAndar": [
            {"nome": "Andar 5", "valor": 15.2, "economia": 54},
            {"nome": "Andar 3", "valor": 12.8, "economia": 40},
            {"nome": "Andar 1", "valor": 8.5, "economia": 14},
            {"nome": "Andar 4", "valor": 10.3, "economia": 25},
            {"nome": "Andar 2", "valor": 9.7, "economia": 17}
        ],
        "economia": {
            "atual": 150,
            "potencial": 250,
            "percentual": 60
        },
        "porProduto": [
            {
                "nome": "Papel Higiênico",
                "desperdicio": 87,
                "percentual": 15,
                "economia": 130,
                "recomendacao": "Instalar dispensers com controle de quantidade"
            },
            {
                "nome": "Sabonete Líquido",
                "desperdicio": 32,
                "percentual": 10,
                "economia": 48,
                "recomendacao": "Utilizar dispensers com sensor"
            },
            {
                "nome": "Papel Toalha",
                "desperdicio": 36,
                "percentual": 15,
                "economia": 54,
                "recomendacao": "Substituir por secadores de mão"
            },
            {
                "nome": "Álcool em Gel",
                "desperdicio": 8,
                "percentual": 10,
                "economia": 12,
                "recomendacao": "Utilizar dispensers com dosagem controlada"
            },
            {
                "nome": "Desinfetante",
                "desperdicio": 4,
                "percentual": 14,
                "economia": 6,
                "recomendacao": "Treinar equipe de limpeza sobre dosagem correta"
            }
        ],
        "causas": [
            {"nome": "Uso excessivo", "valor": 45},
            {"nome": "Dispensers inadequados", "valor": 30},
            {"nome": "Falta de conscientização", "valor": 15},
            {"nome": "Produtos de baixa qualidade", "valor": 10}
        ]
    },
    "comparativo": {
        "periodos": {
            "atual": 1248,
            "anterior": 1150,
            "variacao": 8.5,
            "variacaoPositiva": True
        },
        "genero": {
            "masculinoAtual": 595,
            "femininoAtual": 653,
            "masculinoAnterior": 550,
            "femininoAnterior": 600
        },
        "porAndar": [
            {
                "andar": "Andar 5",
                "periodoAtual": 356,
                "periodoAnterior": 320,
                "variacao": 11.2,
                "masculinoAtual": 170,
                "femininoAtual": 186
            },
            {
                "andar": "Andar 3",
                "periodoAtual": 310,
                "periodoAnterior": 290,
                "variacao": 6.9,
                "masculinoAtual": 150,
                "femininoAtual": 160
            },
            {
                "andar": "Andar 1",
                "periodoAtual": 160,
                "periodoAnterior": 155,
                "variacao": 3.2,
                "masculinoAtual": 75,
                "femininoAtual": 85
            },
            {
                "andar": "Andar 4",
                "periodoAtual": 245,
                "periodoAnterior": 230,
                "variacao": 6.5,
                "masculinoAtual": 120,
                "femininoAtual": 125
            },
            {
                "andar": "Andar 2",
                "periodoAtual": 177,
                "periodoAnterior": 165,
                "variacao": 7.3,
                "masculinoAtual": 80,
                "femininoAtual": 97
            }
        ],
        "sazonalidade": {
            "labels": ["Q1", "Q2", "Q3", "Q4"],
            "datasets": [
                {"nome": "2024", "valores": [1200, 1300, 1100, 1400]},
                {"nome": "2025", "valores": [1250, 1350, 1150, 1450]}
            ]
        }
    }
}

@relatorios_bp.route('/consumo', methods=['GET'])
def get_consumo():
    """Retorna dados de consumo para o relatório"""
    period = request.args.get('period', 30, type=int)
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    compare_with_previous = request.args.get('compareWithPrevious', 'false') == 'true'
    
    # Aqui você poderia ajustar os dados com base nos parâmetros
    # Por enquanto, vamos apenas retornar os dados fictícios
    
    return jsonify(dados_relatorios["consumo"])

@relatorios_bp.route('/desperdicio', methods=['GET'])
def get_desperdicio():
    """Retorna dados de desperdício para o relatório"""
    period = request.args.get('period', 30, type=int)
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    compare_with_previous = request.args.get('compareWithPrevious', 'false') == 'true'
    
    # Aqui você poderia ajustar os dados com base nos parâmetros
    # Por enquanto, vamos apenas retornar os dados fictícios
    
    return jsonify(dados_relatorios["desperdicio"])

@relatorios_bp.route('/comparativo', methods=['GET'])
def get_comparativo():
    """Retorna dados comparativos para o relatório"""
    period = request.args.get('period', 30, type=int)
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    compare_with_previous = request.args.get('compareWithPrevious', 'false') == 'true'
    
    # Aqui você poderia ajustar os dados com base nos parâmetros
    # Por enquanto, vamos apenas retornar os dados fictícios
    
    return jsonify(dados_relatorios["comparativo"])

