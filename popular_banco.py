from src.models import db, Item, Local, Movimentacao, TipoMovimentacao, Evento, User
from src.main import app
from datetime import datetime, timedelta
import random

with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. Locais (andares e banheiros)
    locais = []
    for andar in range(1, 4):
        for tipo in ['masculino', 'feminino']:
            local = Local(andar=andar, tipo_banheiro=tipo, descricao=f'Banheiro {tipo} andar {andar}')
            db.session.add(local)
            locais.append(local)
    db.session.commit()

    # 2. Itens
    itens = [
        Item(codigo='PH001', nome='Papel Higiênico', descricao='Rolo de papel higiênico', quantidade=100, preco_unitario=2.50, categoria='papel higiênico', unidade_medida='rolo', tamanho='grande'),
        Item(codigo='SB001', nome='Sabonete Líquido', descricao='Sabonete líquido neutro', quantidade=50, preco_unitario=8.90, categoria='sabonete', unidade_medida='litro', tamanho='médio'),
        Item(codigo='ALC001', nome='Álcool Gel', descricao='Álcool gel 70%', quantidade=30, preco_unitario=12.00, categoria='álcool', unidade_medida='litro', tamanho='pequeno'),
        Item(codigo='PAP001', nome='Papel Toalha', descricao='Papel toalha interfolhado', quantidade=80, preco_unitario=3.20, categoria='papel toalha', unidade_medida='pacote', tamanho='grande'),
    ]
    db.session.add_all(itens)
    db.session.commit()

    # 3. Movimentações (entradas, saídas, desperdício)
    motivos = ['Reabastecimento', 'Consumo diário', 'Desperdício identificado', 'Troca preventiva']
    for i in range(30):
        item = random.choice(itens)
        local = random.choice(locais)
        tipo = random.choices(
            [TipoMovimentacao.ENTRADA.value, TipoMovimentacao.SAIDA.value, TipoMovimentacao.DESPERDICIO.value],
            weights=[2, 5, 1]
        )[0]
        quantidade = random.randint(1, 10)
        data = datetime.now() - timedelta(days=random.randint(0, 20))
        mov = Movimentacao(
            tipo=tipo,
            quantidade=quantidade,
            data_movimentacao=data,
            motivo=random.choice(motivos),
            responsavel='Equipe Limpeza',
            item_id=item.id,
            local_origem_id=local.id if tipo != TipoMovimentacao.ENTRADA.value else None,
            local_destino_id=local.id if tipo == TipoMovimentacao.ENTRADA.value else None
        )
        db.session.add(mov)
    db.session.commit()

    # 4. Eventos
    eventos = [
        Evento(titulo='Limpeza Programada', descricao='Limpeza geral do banheiro', data=datetime.now() + timedelta(days=2), tipo='manutencao'),
        Evento(titulo='Reunião de Equipe', descricao='Reunião para discutir redução de desperdício', data=datetime.now() + timedelta(days=5), tipo='outro'),
        Evento(titulo='Troca de Dispensers', descricao='Troca dos dispensers de sabonete', data=datetime.now() + timedelta(days=7), tipo='manutencao'),
    ]
    db.session.add_all(eventos)
    db.session.commit()

    # 5. Usuário fictício
    user = User(username='admin', email='admin@empresa.com')
    db.session.add(user)
    db.session.commit()

print('Banco populado com dados fictícios!') 