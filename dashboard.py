from flask import Blueprint, jsonify, request
from src.models import db, Item, Local, Movimentacao
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import random

dashboard_bp = Blueprint('dashboard', __name__)

# Função auxiliar para gerar dados de teste
def gerar_dados_teste():
    """Gera dados de teste para o dashboard"""
    
    # Verificar se já existem dados
    if Item.query.count() > 0 or Local.query.count() > 0:
        return
    
    # Criar locais (banheiros)
    locais = []
    for andar in range(1, 6):  # 5 andares
        # Banheiro masculino
        local_m = Local(
            codigo=f"BM{andar}",
            nome=f"Banheiro Masculino - Andar {andar}",
            descricao=f"Banheiro masculino localizado no andar {andar}",
            andar=andar,
            tipo_banheiro="masculino"
        )
        db.session.add(local_m)
        locais.append(local_m)
        
        # Banheiro feminino
        local_f = Local(
            codigo=f"BF{andar}",
            nome=f"Banheiro Feminino - Andar {andar}",
            descricao=f"Banheiro feminino localizado no andar {andar}",
            andar=andar,
            tipo_banheiro="feminino"
        )
        db.session.add(local_f)
        locais.append(local_f)
    
    # Criar estoque central
    estoque = Local(
        codigo="EST",
        nome="Estoque Central",
        descricao="Local de armazenamento central dos produtos",
        andar=0,
        tipo_banheiro=None
    )
    db.session.add(estoque)
    db.session.commit()
    
    # Criar produtos
    produtos = [
        {"codigo": "PH001", "nome": "Papel Higiênico 30m", "categoria": "papel higiênico", "unidade_medida": "rolo"},
        {"codigo": "PH002", "nome": "Papel Higiênico 60m", "categoria": "papel higiênico", "unidade_medida": "rolo"},
        {"codigo": "SB001", "nome": "Sabonete Líquido", "categoria": "sabonete", "unidade_medida": "litro"},
        {"codigo": "PT001", "nome": "Papel Toalha", "categoria": "papel toalha", "unidade_medida": "pacote"},
        {"codigo": "PT002", "nome": "Papel Toalha Interfolha", "categoria": "papel toalha", "unidade_medida": "pacote"}
    ]
    
    itens = []
    for produto in produtos:
        item = Item(
            codigo=produto["codigo"],
            nome=produto["nome"],
            categoria=produto["categoria"],
            unidade_medida=produto["unidade_medida"],
            quantidade=random.randint(50, 200),
            local_id=estoque.id
        )
        db.session.add(item)
        itens.append(item)
    
    db.session.commit()
    
    # Criar movimentações
    data_atual = datetime.now()
    
    # Consumo por andar (baseado no exemplo do usuário)
    consumo_masculino = {
        1: 31,   # Andar 1: 31 unidades
        2: 83,   # Andar 2: 83 unidades
        3: 116,  # Andar 3: 116 unidades
        4: 63,   # Andar 4: 63 unidades
        5: 170   # Andar 5: 170 unidades
    }
    
    consumo_feminino = {
        1: 129,  # Andar 1: 129 unidades
        2: 94,   # Andar 2: 94 unidades
        3: 194,  # Andar 3: 194 unidades
        4: 86,   # Andar 4: 86 unidades
        5: 186   # Andar 5: 186 unidades
    }
    
    # Distribuição de produtos (percentual)
    distribuicao_produtos = {
        "papel higiênico": 0.6,    # 60% papel higiênico
        "sabonete": 0.3,           # 30% sabonete
        "papel toalha": 0.1        # 10% papel toalha
    }
    
    # Gerar movimentações para os últimos 30 dias
    for dia in range(30):
        data = data_atual - timedelta(days=dia)
        
        # Movimentações para cada andar
        for andar in range(1, 6):
            # Banheiro masculino
            local_m = next(l for l in locais if l.andar == andar and l.tipo_banheiro == "masculino")
            consumo_diario_m = max(1, int(consumo_masculino[andar] / 30))  # Distribuir ao longo de 30 dias
            
            # Banheiro feminino
            local_f = next(l for l in locais if l.andar == andar and l.tipo_banheiro == "feminino")
            consumo_diario_f = max(1, int(consumo_feminino[andar] / 30))  # Distribuir ao longo de 30 dias
            
            # Distribuir entre os produtos
            for categoria, percentual in distribuicao_produtos.items():
                # Selecionar um item aleatório da categoria
                itens_categoria = [i for i in itens if i.categoria == categoria]
                if not itens_categoria:
                    continue
                
                item = random.choice(itens_categoria)
                
                # Calcular quantidade para cada banheiro
                qtd_m = max(1, int(consumo_diario_m * percentual))
                qtd_f = max(1, int(consumo_diario_f * percentual))
                
                # Adicionar variação aleatória
                qtd_m = max(1, int(qtd_m * random.uniform(0.8, 1.2)))
                qtd_f = max(1, int(qtd_f * random.uniform(0.8, 1.2)))
                
                # Criar movimentações para horários diferentes do dia
                hora_m = random.randint(8, 17)
                hora_f = random.randint(8, 17)
                
                # Movimentação masculina
                mov_m = Movimentacao(
                    tipo="saida",
                    quantidade=qtd_m,
                    data_movimentacao=data.replace(hour=hora_m, minute=random.randint(0, 59)),
                    motivo="Consumo regular",
                    item_id=item.id,
                    local_origem_id=local_m.id
                )
                db.session.add(mov_m)
                
                # Movimentação feminina
                mov_f = Movimentacao(
                    tipo="saida",
                    quantidade=qtd_f,
                    data_movimentacao=data.replace(hour=hora_f, minute=random.randint(0, 59)),
                    motivo="Consumo regular",
                    item_id=item.id,
                    local_origem_id=local_f.id
                )
                db.session.add(mov_f)
    
    # Commit final
    db.session.commit()

@dashboard_bp.route('/inicializar-dados-teste', methods=['POST'])
def inicializar_dados_teste():
    """Inicializa dados de teste para o dashboard"""
    try:
        gerar_dados_teste()
        return jsonify({"mensagem": "Dados de teste gerados com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@dashboard_bp.route('/kpis', methods=['GET'])
def get_kpis():
    """Retorna os KPIs principais para o dashboard"""
    
    # Total de itens
    total_itens = Item.query.count()
    
    # Total de locais (banheiros)
    total_locais = Local.query.count()
    
    # Total de andares únicos
    total_andares = db.session.query(func.count(func.distinct(Local.andar))).scalar() or 0
    
    # Total de movimentações nos últimos 30 dias
    data_limite = datetime.now() - timedelta(days=30)
    total_movimentacoes = Movimentacao.query.filter(
        Movimentacao.data_movimentacao >= data_limite
    ).count()
    
    # Total de saídas (consumo) nos últimos 30 dias
    total_consumo = db.session.query(func.sum(Movimentacao.quantidade)).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite
    ).scalar() or 0
    
    return jsonify({
        'total_itens': total_itens,
        'total_locais': total_locais,
        'total_andares': total_andares,
        'total_movimentacoes': total_movimentacoes,
        'total_consumo': int(total_consumo)
    })

@dashboard_bp.route('/consumo-por-andar/<int:dias>', methods=['GET'])
def get_consumo_por_andar(dias):
    """Retorna o consumo por andar no período especificado"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter o consumo por andar
    consumo_por_andar = db.session.query(
        Local.andar,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite,
        Local.andar != None
    ).group_by(
        Local.andar
    ).order_by(
        desc('quantidade_total')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'andar': andar,
            'quantidade': int(quantidade_total)
        } for andar, quantidade_total in consumo_por_andar
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/consumo-por-banheiro/<int:dias>', methods=['GET'])
def get_consumo_por_banheiro(dias):
    """Retorna o consumo por banheiro no período especificado"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter o consumo por banheiro
    consumo_por_banheiro = db.session.query(
        Local.id,
        Local.nome,
        Local.andar,
        Local.tipo_banheiro,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite
    ).group_by(
        Local.id,
        Local.nome,
        Local.andar,
        Local.tipo_banheiro
    ).order_by(
        desc('quantidade_total')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'id': local_id,
            'nome': nome,
            'andar': andar,
            'tipo_banheiro': tipo_banheiro,
            'quantidade': int(quantidade_total)
        } for local_id, nome, andar, tipo_banheiro, quantidade_total in consumo_por_banheiro
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/consumo-por-produto/<int:dias>', methods=['GET'])
def get_consumo_por_produto(dias):
    """Retorna o consumo por produto no período especificado"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter o consumo por produto
    consumo_por_produto = db.session.query(
        Item.id,
        Item.nome,
        Item.categoria,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Item.id == Movimentacao.item_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite
    ).group_by(
        Item.id,
        Item.nome,
        Item.categoria
    ).order_by(
        desc('quantidade_total')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'id': item_id,
            'nome': nome,
            'categoria': categoria,
            'quantidade': int(quantidade_total)
        } for item_id, nome, categoria, quantidade_total in consumo_por_produto
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/consumo-por-produto-andar/<int:dias>', methods=['GET'])
def get_consumo_por_produto_andar(dias):
    """Retorna o consumo por produto e andar no período especificado"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter o consumo por produto e andar
    consumo_por_produto_andar = db.session.query(
        Item.id,
        Item.nome,
        Item.categoria,
        Local.andar,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Item.id == Movimentacao.item_id
    ).join(
        Local,
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite,
        Local.andar != None
    ).group_by(
        Item.id,
        Item.nome,
        Item.categoria,
        Local.andar
    ).order_by(
        Local.andar,
        desc('quantidade_total')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'item_id': item_id,
            'item_nome': nome,
            'categoria': categoria,
            'andar': andar,
            'quantidade': int(quantidade_total)
        } for item_id, nome, categoria, andar, quantidade_total in consumo_por_produto_andar
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/consumo-por-produto-banheiro/<int:dias>', methods=['GET'])
def get_consumo_por_produto_banheiro(dias):
    """Retorna o consumo por produto e tipo de banheiro no período especificado"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter o consumo por produto e tipo de banheiro
    consumo_por_produto_banheiro = db.session.query(
        Item.id,
        Item.nome,
        Item.categoria,
        Local.tipo_banheiro,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Item.id == Movimentacao.item_id
    ).join(
        Local,
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite,
        Local.tipo_banheiro != None
    ).group_by(
        Item.id,
        Item.nome,
        Item.categoria,
        Local.tipo_banheiro
    ).order_by(
        Local.tipo_banheiro,
        desc('quantidade_total')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'item_id': item_id,
            'item_nome': nome,
            'categoria': categoria,
            'tipo_banheiro': tipo_banheiro,
            'quantidade': int(quantidade_total)
        } for item_id, nome, categoria, tipo_banheiro, quantidade_total in consumo_por_produto_banheiro
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/tendencia-consumo/<int:dias>', methods=['GET'])
def get_tendencia_consumo(dias):
    """Retorna a tendência de consumo nos últimos dias"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Criar lista de datas para o período
    datas = []
    for i in range(dias):
        data = datetime.now() - timedelta(days=i)
        datas.append(data.strftime('%Y-%m-%d'))
    
    datas.reverse()  # Ordenar do mais antigo para o mais recente
    
    # Consulta para obter consumo por dia
    consumo_por_dia = db.session.query(
        func.date(Movimentacao.data_movimentacao).label('data'),
        func.sum(Movimentacao.quantidade).label('total')
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite
    ).group_by(
        func.date(Movimentacao.data_movimentacao)
    ).all()
    
    # Converter para dicionários para facilitar o acesso
    dict_consumo = {str(consumo.data): int(consumo.total) for consumo in consumo_por_dia}
    
    # Montar resultado final com todas as datas
    resultado = []
    for data in datas:
        resultado.append({
            'data': data,
            'consumo': dict_consumo.get(data, 0)
        })
    
    return jsonify(resultado)

@dashboard_bp.route('/horarios-pico/<int:dias>', methods=['GET'])
def get_horarios_pico(dias):
    """Retorna os horários de pico de consumo"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter consumo por hora do dia
    consumo_por_hora = db.session.query(
        func.extract('hour', Movimentacao.data_movimentacao).label('hora'),
        func.sum(Movimentacao.quantidade).label('total')
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite
    ).group_by(
        func.extract('hour', Movimentacao.data_movimentacao)
    ).order_by(
        'hora'
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'hora': int(hora),
            'consumo': int(total)
        } for hora, total in consumo_por_hora
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/analise-desperdicio/<int:dias>', methods=['GET'])
def get_analise_desperdicio(dias):
    """Retorna análise de desperdício por andar e banheiro"""
    
    data_limite = datetime.now() - timedelta(days=dias)
    
    # Consulta para obter consumo de papel higiênico por andar e banheiro
    consumo_papel = db.session.query(
        Local.andar,
        Local.tipo_banheiro,
        func.sum(Movimentacao.quantidade).label('quantidade_total')
    ).join(
        Movimentacao, 
        Local.id == Movimentacao.local_origem_id
    ).join(
        Item,
        Item.id == Movimentacao.item_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Movimentacao.data_movimentacao >= data_limite,
        Item.categoria == 'papel higiênico'
    ).group_by(
        Local.andar,
        Local.tipo_banheiro
    ).order_by(
        Local.andar,
        Local.tipo_banheiro
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'andar': andar,
            'tipo_banheiro': tipo_banheiro,
            'consumo_papel': int(quantidade_total),
            # Aqui poderia ter uma lógica para calcular o desperdício estimado
            # baseado em algum parâmetro ou média de consumo esperado
            'desperdicio_estimado': int(round(quantidade_total * 0.1))  # Estimativa de 10% de desperdício
        } for andar, tipo_banheiro, quantidade_total in consumo_papel
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/ranking-banheiros-masculino', methods=['GET'])
def get_ranking_banheiros_masculino():
    """Retorna o ranking de banheiros masculinos por consumo"""
    
    # Consulta para obter o ranking de banheiros masculinos
    ranking = db.session.query(
        Local.id,
        Local.nome,
        Local.andar,
        func.sum(Movimentacao.quantidade).label('total_consumo')
    ).join(
        Movimentacao, 
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Local.tipo_banheiro == 'masculino'
    ).group_by(
        Local.id,
        Local.nome,
        Local.andar
    ).order_by(
        desc('total_consumo')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'id': local_id,
            'localizacao': f"{i+1}. Base Dasa Wtorre - Andar {andar} - Masculino",
            'entrada': int(total_consumo)
        } for i, (local_id, nome, andar, total_consumo) in enumerate(ranking)
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/ranking-banheiros-feminino', methods=['GET'])
def get_ranking_banheiros_feminino():
    """Retorna o ranking de banheiros femininos por consumo"""
    
    # Consulta para obter o ranking de banheiros femininos
    ranking = db.session.query(
        Local.id,
        Local.nome,
        Local.andar,
        func.sum(Movimentacao.quantidade).label('total_consumo')
    ).join(
        Movimentacao, 
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Local.tipo_banheiro == 'feminino'
    ).group_by(
        Local.id,
        Local.nome,
        Local.andar
    ).order_by(
        desc('total_consumo')
    ).all()
    
    # Formatar resultados
    resultado = [
        {
            'id': local_id,
            'localizacao': f"{i+1}. Base Dasa Wtorre - Andar {andar} - Feminino",
            'entrada': int(total_consumo)
        } for i, (local_id, nome, andar, total_consumo) in enumerate(ranking)
    ]
    
    return jsonify(resultado)

@dashboard_bp.route('/horario-movimentacao/<int:andar>/<string:tipo_banheiro>', methods=['GET'])
def get_horario_movimentacao(andar, tipo_banheiro):
    """Retorna os horários de movimentação por andar e tipo de banheiro"""
    
    # Consulta para obter movimentação por hora para o andar e tipo de banheiro específico
    movimentacao_por_hora = db.session.query(
        func.extract('hour', Movimentacao.data_movimentacao).label('hora'),
        func.sum(Movimentacao.quantidade).label('total')
    ).join(
        Local, 
        Local.id == Movimentacao.local_origem_id
    ).filter(
        Movimentacao.tipo == 'saida',
        Local.andar == andar,
        Local.tipo_banheiro == tipo_banheiro
    ).group_by(
        func.extract('hour', Movimentacao.data_movimentacao)
    ).order_by(
        'hora'
    ).all()
    
    # Formatar resultados para o formato esperado pelo gráfico
    horas = ['08:00', '09:00', '10:00', '11:00', '12:00']
    dados = []
    
    for hora, total in movimentacao_por_hora:
        if 8 <= int(hora) <= 12:  # Filtrando apenas horário comercial
            dados.append({
                'hora': f'{int(hora):02d}:00',
                'entradas': int(total)
            })
    
    # Preencher horas sem dados
    horas_com_dados = [d['hora'] for d in dados]
    for hora in horas:
        if hora not in horas_com_dados:
            dados.append({
                'hora': hora,
                'entradas': 0
            })
    
    # Ordenar por hora
    dados.sort(key=lambda x: x['hora'])
    
    resultado = {
        'andar': andar,
        'tipo_banheiro': tipo_banheiro,
        'dados': dados
    }
    
    return jsonify(resultado)
