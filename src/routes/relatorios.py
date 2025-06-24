from flask import Blueprint, jsonify, request
from src.models import db, Item, Movimentacao, Local
from datetime import datetime, timedelta
from sqlalchemy import func

relatorios_bp = Blueprint('relatorios', __name__)

@relatorios_bp.route('/consumo', methods=['GET'])
def get_relatorio_consumo():
    """Retorna dados reais de consumo para relatórios"""
    try:
        periodo = int(request.args.get('periodo', '30'))
        data_inicio = datetime.now() - timedelta(days=periodo)
        
        # Consumo por andar (baseado em locais reais)
        consumo_por_andar = []
        locais = Local.query.all()
        
        for local in locais:
            # Aqui você implementaria a lógica para associar movimentações a locais
            # Por enquanto, vamos calcular consumo geral
            consumo_masculino = 0
            consumo_feminino = 0
            
            if local.tipo.lower() == 'masculino':
                consumo_masculino = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                    Movimentacao.tipo == 'saida',
                    Movimentacao.data_movimentacao >= data_inicio
                ).scalar() or 0
            elif local.tipo.lower() == 'feminino':
                consumo_feminino = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                    Movimentacao.tipo == 'saida',
                    Movimentacao.data_movimentacao >= data_inicio
                ).scalar() or 0
            
            total = consumo_masculino + consumo_feminino
            
            if total > 0:  # Só inclui se houver consumo
                consumo_por_andar.append({
                    'andar': f'{local.andar}º Andar',
                    'masculino': int(consumo_masculino),
                    'feminino': int(consumo_feminino),
                    'total': int(total)
                })
        
        # Consumo por produto (dados reais)
        consumo_por_produto = db.session.query(
            Item.nome,
            func.sum(Movimentacao.quantidade).label('quantidade'),
            Item.unidade
        ).join(Movimentacao).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).group_by(Item.id).order_by(
            func.sum(Movimentacao.quantidade).desc()
        ).all()
        
        produtos_data = []
        for produto in consumo_por_produto:
            produtos_data.append({
                'produto': produto.nome,
                'quantidade': int(produto.quantidade),
                'unidade': produto.unidade
            })
        
        total_geral = sum(item['total'] for item in consumo_por_andar)
        
        return jsonify({
            'consumo_por_andar': consumo_por_andar,
            'consumo_por_produto': produtos_data,
            'periodo': f'Últimos {periodo} dias',
            'total_geral': total_geral
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/desperdicio', methods=['GET'])
def get_relatorio_desperdicio():
    """Retorna dados reais de desperdício para relatórios"""
    try:
        periodo = int(request.args.get('periodo', '30'))
        data_inicio = datetime.now() - timedelta(days=periodo)
        
        # Calcula desperdício baseado em entradas vs saídas
        total_entradas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'entrada',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        total_saidas = db.session.query(func.sum(Movimentacao.quantidade)).filter(
            Movimentacao.tipo == 'saida',
            Movimentacao.data_movimentacao >= data_inicio
        ).scalar() or 0
        
        # Desperdício por andar (baseado em locais)
        desperdicio_por_andar = []
        locais = Local.query.all()
        
        for local in locais:
            # Calcula desperdício estimado por local
            if total_entradas > 0:
                desperdicio_percentual = ((total_entradas - total_saidas) / total_entradas) * 100
                economia_potencial = (desperdicio_percentual / 100) * 200  # Valor estimado
                
                desperdicio_por_andar.append({
                    'andar': f'{local.andar}º Andar',
                    'desperdicio': round(desperdicio_percentual, 1),
                    'economia_potencial': round(economia_potencial, 0)
                })
        
        # Desperdício por produto
        desperdicio_por_produto = []
        produtos = Item.query.all()
        
        for produto in produtos:
            entradas_produto = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.item_id == produto.id,
                Movimentacao.tipo == 'entrada',
                Movimentacao.data_movimentacao >= data_inicio
            ).scalar() or 0
            
            saidas_produto = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.item_id == produto.id,
                Movimentacao.tipo == 'saida',
                Movimentacao.data_movimentacao >= data_inicio
            ).scalar() or 0
            
            if entradas_produto > 0:
                desperdicio_produto = ((entradas_produto - saidas_produto) / entradas_produto) * 100
                valor_perdido = desperdicio_produto * float(produto.preco_unitario or 0)
                
                if desperdicio_produto > 0:
                    desperdicio_por_produto.append({
                        'produto': produto.nome,
                        'desperdicio': round(desperdicio_produto, 1),
                        'valor_perdido': round(valor_perdido, 0)
                    })
        
        # Cálculos gerais
        desperdicio_total = 0
        if total_entradas > 0:
            desperdicio_total = ((total_entradas - total_saidas) / total_entradas) * 100
        
        valor_total_perdido = sum(item['valor_perdido'] for item in desperdicio_por_produto)
        economia_potencial_total = valor_total_perdido * 0.75  # 75% de economia potencial
        
        return jsonify({
            'desperdicio_por_andar': desperdicio_por_andar,
            'desperdicio_por_produto': desperdicio_por_produto,
            'desperdicio_total': round(desperdicio_total, 1),
            'valor_total_perdido': round(valor_total_perdido, 0),
            'economia_potencial_total': round(economia_potencial_total, 0)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/comparativo', methods=['GET'])
def get_relatorio_comparativo():
    """Retorna dados comparativos reais para relatórios"""
    try:
        periodo_atual = int(request.args.get('periodo_atual', '30'))
        periodo_anterior = int(request.args.get('periodo_anterior', '30'))
        
        # Período atual
        data_inicio_atual = datetime.now() - timedelta(days=periodo_atual)
        data_fim_atual = datetime.now()
        
        # Período anterior
        data_inicio_anterior = datetime.now() - timedelta(days=periodo_atual + periodo_anterior)
        data_fim_anterior = datetime.now() - timedelta(days=periodo_atual)
        
        # Comparativo de consumo por produto
        comparativo_consumo = []
        produtos = Item.query.all()
        
        for produto in produtos:
            # Consumo atual
            consumo_atual = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.item_id == produto.id,
                Movimentacao.tipo == 'saida',
                Movimentacao.data_movimentacao >= data_inicio_atual,
                Movimentacao.data_movimentacao <= data_fim_atual
            ).scalar() or 0
            
            # Consumo anterior
            consumo_anterior = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                Movimentacao.item_id == produto.id,
                Movimentacao.tipo == 'saida',
                Movimentacao.data_movimentacao >= data_inicio_anterior,
                Movimentacao.data_movimentacao <= data_fim_anterior
            ).scalar() or 0
            
            # Calcula variação
            if consumo_anterior > 0:
                variacao = ((consumo_atual - consumo_anterior) / consumo_anterior) * 100
            else:
                variacao = 0 if consumo_atual == 0 else 100
            
            if consumo_atual > 0 or consumo_anterior > 0:
                comparativo_consumo.append({
                    'categoria': produto.nome,
                    'atual': int(consumo_atual),
                    'anterior': int(consumo_anterior),
                    'variacao': round(variacao, 1)
                })
        
        # Comparativo por tipo de banheiro
        comparativo_banheiros = []
        tipos_banheiro = ['masculino', 'feminino']
        
        for tipo in tipos_banheiro:
            locais_tipo = Local.query.filter(Local.tipo.ilike(f'%{tipo}%')).all()
            
            # Para simplificar, vamos usar dados gerais
            # Em uma implementação real, você associaria movimentações a locais específicos
            consumo_atual_tipo = 0
            consumo_anterior_tipo = 0
            
            if locais_tipo:
                # Consumo proporcional baseado no número de locais deste tipo
                total_locais = Local.query.count()
                proporcao = len(locais_tipo) / total_locais if total_locais > 0 else 0
                
                consumo_total_atual = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                    Movimentacao.tipo == 'saida',
                    Movimentacao.data_movimentacao >= data_inicio_atual,
                    Movimentacao.data_movimentacao <= data_fim_atual
                ).scalar() or 0
                
                consumo_total_anterior = db.session.query(func.sum(Movimentacao.quantidade)).filter(
                    Movimentacao.tipo == 'saida',
                    Movimentacao.data_movimentacao >= data_inicio_anterior,
                    Movimentacao.data_movimentacao <= data_fim_anterior
                ).scalar() or 0
                
                consumo_atual_tipo = int(consumo_total_atual * proporcao)
                consumo_anterior_tipo = int(consumo_total_anterior * proporcao)
            
            # Calcula variação
            if consumo_anterior_tipo > 0:
                variacao = ((consumo_atual_tipo - consumo_anterior_tipo) / consumo_anterior_tipo) * 100
            else:
                variacao = 0 if consumo_atual_tipo == 0 else 100
            
            comparativo_banheiros.append({
                'banheiro': tipo.capitalize(),
                'atual': consumo_atual_tipo,
                'anterior': consumo_anterior_tipo,
                'variacao': round(variacao, 1)
            })
        
        # Tendência geral
        total_atual = sum(item['atual'] for item in comparativo_consumo)
        total_anterior = sum(item['anterior'] for item in comparativo_consumo)
        
        if total_anterior > 0:
            tendencia_geral = ((total_atual - total_anterior) / total_anterior) * 100
            if tendencia_geral > 0:
                tendencia_texto = f'Aumento de {abs(tendencia_geral):.1f}% no consumo total'
            else:
                tendencia_texto = f'Redução de {abs(tendencia_geral):.1f}% no consumo total'
        else:
            tendencia_texto = 'Dados insuficientes para análise de tendência'
        
        return jsonify({
            'comparativo_consumo': comparativo_consumo,
            'comparativo_banheiros': comparativo_banheiros,
            'periodo_atual': f'Últimos {periodo_atual} dias',
            'periodo_anterior': f'{periodo_anterior} dias anteriores',
            'tendencia_geral': tendencia_texto
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

