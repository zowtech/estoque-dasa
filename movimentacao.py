from flask import Blueprint, request, jsonify
from src.models import db, Item, Local, Movimentacao, TipoMovimentacao
from datetime import datetime

movimentacao_bp = Blueprint('movimentacao', __name__)

@movimentacao_bp.route('/', methods=['GET'])
def listar_movimentacoes():
    """Lista todas as movimentações de estoque"""
    movimentacoes = Movimentacao.query.all()
    resultado = []
    
    for mov in movimentacoes:
        item_nome = mov.item.nome if mov.item else "Item não encontrado"
        origem = mov.local_origem.nome if mov.local_origem else "N/A"
        destino = mov.local_destino.nome if mov.local_destino else "N/A"
        
        resultado.append({
            'id': mov.id,
            'tipo': mov.tipo,
            'item': item_nome,
            'item_id': mov.item_id,
            'quantidade': mov.quantidade,
            'data_movimentacao': mov.data_movimentacao.strftime('%d/%m/%Y %H:%M'),
            'motivo': mov.motivo,
            'documento': mov.documento,
            'responsavel': mov.responsavel,
            'local_origem': origem,
            'local_destino': destino
        })
    
    return jsonify(resultado)

@movimentacao_bp.route('/entrada', methods=['POST'])
def registrar_entrada():
    """Registra uma entrada de itens no estoque"""
    dados = request.json
    
    # Validação básica
    if not dados.get('item_id') or not dados.get('quantidade'):
        return jsonify({'erro': 'Item e quantidade são obrigatórios'}), 400
    
    if dados.get('quantidade', 0) <= 0:
        return jsonify({'erro': 'Quantidade deve ser maior que zero'}), 400
    
    # Verifica se o item existe
    item = Item.query.get(dados['item_id'])
    if not item:
        return jsonify({'erro': 'Item não encontrado'}), 404
    
    # Verifica se o local de destino existe, se informado
    local_destino_id = dados.get('local_destino_id')
    if local_destino_id and not Local.query.get(local_destino_id):
        return jsonify({'erro': 'Local de destino não encontrado'}), 404
    
    # Cria a movimentação de entrada
    nova_movimentacao = Movimentacao(
        tipo=TipoMovimentacao.ENTRADA.value,
        item_id=dados['item_id'],
        quantidade=dados['quantidade'],
        motivo=dados.get('motivo'),
        documento=dados.get('documento'),
        responsavel=dados.get('responsavel'),
        observacao=dados.get('observacao'),
        local_destino_id=local_destino_id
    )
    
    # Atualiza a quantidade do item
    item.quantidade += dados['quantidade']
    
    # Atualiza a localização do item, se informada
    if local_destino_id:
        item.local_id = local_destino_id
    
    db.session.add(nova_movimentacao)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Entrada registrada com sucesso',
        'id': nova_movimentacao.id,
        'nova_quantidade': item.quantidade
    }), 201

@movimentacao_bp.route('/saida', methods=['POST'])
def registrar_saida():
    """Registra uma saída de itens do estoque"""
    dados = request.json
    
    # Validação básica
    if not dados.get('item_id') or not dados.get('quantidade'):
        return jsonify({'erro': 'Item e quantidade são obrigatórios'}), 400
    
    if dados.get('quantidade', 0) <= 0:
        return jsonify({'erro': 'Quantidade deve ser maior que zero'}), 400
    
    # Verifica se o item existe
    item = Item.query.get(dados['item_id'])
    if not item:
        return jsonify({'erro': 'Item não encontrado'}), 404
    
    # Verifica se há quantidade suficiente
    if item.quantidade < dados['quantidade']:
        return jsonify({'erro': 'Quantidade insuficiente em estoque'}), 400
    
    # Verifica se o local de origem existe, se informado
    local_origem_id = dados.get('local_origem_id', item.local_id)
    if local_origem_id and not Local.query.get(local_origem_id):
        return jsonify({'erro': 'Local de origem não encontrado'}), 404
    
    # Cria a movimentação de saída
    nova_movimentacao = Movimentacao(
        tipo=TipoMovimentacao.SAIDA.value,
        item_id=dados['item_id'],
        quantidade=dados['quantidade'],
        motivo=dados.get('motivo'),
        documento=dados.get('documento'),
        responsavel=dados.get('responsavel'),
        observacao=dados.get('observacao'),
        local_origem_id=local_origem_id
    )
    
    # Atualiza a quantidade do item
    item.quantidade -= dados['quantidade']
    
    db.session.add(nova_movimentacao)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Saída registrada com sucesso',
        'id': nova_movimentacao.id,
        'nova_quantidade': item.quantidade
    }), 201

@movimentacao_bp.route('/item/<int:item_id>', methods=['GET'])
def listar_movimentacoes_por_item(item_id):
    """Lista todas as movimentações de um item específico"""
    # Verifica se o item existe
    if not Item.query.get(item_id):
        return jsonify({'erro': 'Item não encontrado'}), 404
    
    movimentacoes = Movimentacao.query.filter_by(item_id=item_id).all()
    resultado = []
    
    for mov in movimentacoes:
        origem = mov.local_origem.nome if mov.local_origem else "N/A"
        destino = mov.local_destino.nome if mov.local_destino else "N/A"
        
        resultado.append({
            'id': mov.id,
            'tipo': mov.tipo,
            'quantidade': mov.quantidade,
            'data_movimentacao': mov.data_movimentacao.strftime('%d/%m/%Y %H:%M'),
            'motivo': mov.motivo,
            'documento': mov.documento,
            'responsavel': mov.responsavel,
            'local_origem': origem,
            'local_destino': destino
        })
    
    return jsonify(resultado)

@movimentacao_bp.route('/transferir', methods=['POST'])
def transferir_item():
    """Transfere itens entre locais de armazenamento"""
    dados = request.json
    
    # Validação básica
    if not dados.get('item_id') or not dados.get('quantidade') or not dados.get('local_origem_id') or not dados.get('local_destino_id'):
        return jsonify({'erro': 'Item, quantidade, local de origem e local de destino são obrigatórios'}), 400
    
    if dados.get('quantidade', 0) <= 0:
        return jsonify({'erro': 'Quantidade deve ser maior que zero'}), 400
    
    # Verifica se o item existe
    item = Item.query.get(dados['item_id'])
    if not item:
        return jsonify({'erro': 'Item não encontrado'}), 404
    
    # Verifica se os locais existem
    local_origem = Local.query.get(dados['local_origem_id'])
    local_destino = Local.query.get(dados['local_destino_id'])
    
    if not local_origem:
        return jsonify({'erro': 'Local de origem não encontrado'}), 404
    
    if not local_destino:
        return jsonify({'erro': 'Local de destino não encontrado'}), 404
    
    # Verifica se o item está no local de origem
    if item.local_id != dados['local_origem_id']:
        return jsonify({'erro': 'Item não está no local de origem especificado'}), 400
    
    # Verifica se há quantidade suficiente
    if item.quantidade < dados['quantidade']:
        return jsonify({'erro': 'Quantidade insuficiente em estoque'}), 400
    
    # Cria a movimentação de transferência (saída + entrada)
    nova_movimentacao = Movimentacao(
        tipo='transferencia',
        item_id=dados['item_id'],
        quantidade=dados['quantidade'],
        motivo=dados.get('motivo', 'Transferência entre locais'),
        responsavel=dados.get('responsavel'),
        observacao=dados.get('observacao'),
        local_origem_id=dados['local_origem_id'],
        local_destino_id=dados['local_destino_id']
    )
    
    # Atualiza a localização do item
    item.local_id = dados['local_destino_id']
    
    db.session.add(nova_movimentacao)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Transferência registrada com sucesso',
        'id': nova_movimentacao.id
    }), 201
