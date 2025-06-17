from flask import Blueprint, request, jsonify
from src.models import db, Item, Local

item_bp = Blueprint('item', __name__)

@item_bp.route('/', methods=['GET'])
def listar_itens():
    """Lista todos os itens do estoque"""
    itens = Item.query.all()
    resultado = []
    
    for item in itens:
        local_nome = item.local.nome if item.local else "Sem localização"
        
        resultado.append({
            'id': item.id,
            'codigo': item.codigo,
            'nome': item.nome,
            'descricao': item.descricao,
            'quantidade': item.quantidade,
            'preco_unitario': item.preco_unitario,
            'local': local_nome,
            'data_cadastro': item.data_cadastro.strftime('%d/%m/%Y %H:%M'),
            'data_atualizacao': item.data_atualizacao.strftime('%d/%m/%Y %H:%M')
        })
    
    return jsonify(resultado)

@item_bp.route('/<int:item_id>', methods=['GET'])
def obter_item(item_id):
    """Obtém detalhes de um item específico"""
    item = Item.query.get_or_404(item_id)
    
    local_nome = item.local.nome if item.local else "Sem localização"
    
    resultado = {
        'id': item.id,
        'codigo': item.codigo,
        'nome': item.nome,
        'descricao': item.descricao,
        'quantidade': item.quantidade,
        'preco_unitario': item.preco_unitario,
        'local': local_nome,
        'local_id': item.local_id,
        'data_cadastro': item.data_cadastro.strftime('%d/%m/%Y %H:%M'),
        'data_atualizacao': item.data_atualizacao.strftime('%d/%m/%Y %H:%M')
    }
    
    return jsonify(resultado)

@item_bp.route('/', methods=['POST'])
def criar_item():
    """Cria um novo item no estoque"""
    dados = request.json
    
    # Validação básica
    if not dados.get('codigo') or not dados.get('nome'):
        return jsonify({'erro': 'Código e nome são obrigatórios'}), 400
    
    # Verifica se o código já existe
    if Item.query.filter_by(codigo=dados['codigo']).first():
        return jsonify({'erro': 'Código já cadastrado'}), 400
    
    # Verifica se o local existe, se informado
    local_id = dados.get('local_id')
    if local_id and not Local.query.get(local_id):
        return jsonify({'erro': 'Local não encontrado'}), 400
    
    novo_item = Item(
        codigo=dados['codigo'],
        nome=dados['nome'],
        descricao=dados.get('descricao'),
        quantidade=dados.get('quantidade', 0),
        preco_unitario=dados.get('preco_unitario'),
        local_id=local_id
    )
    
    db.session.add(novo_item)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Item cadastrado com sucesso',
        'id': novo_item.id
    }), 201

@item_bp.route('/<int:item_id>', methods=['PUT'])
def atualizar_item(item_id):
    """Atualiza um item existente"""
    item = Item.query.get_or_404(item_id)
    dados = request.json
    
    # Atualiza os campos
    if 'nome' in dados:
        item.nome = dados['nome']
    if 'descricao' in dados:
        item.descricao = dados['descricao']
    if 'preco_unitario' in dados:
        item.preco_unitario = dados['preco_unitario']
    if 'local_id' in dados:
        # Verifica se o local existe
        if dados['local_id'] and not Local.query.get(dados['local_id']):
            return jsonify({'erro': 'Local não encontrado'}), 400
        item.local_id = dados['local_id']
    
    db.session.commit()
    
    return jsonify({'mensagem': 'Item atualizado com sucesso'})

@item_bp.route('/<int:item_id>', methods=['DELETE'])
def excluir_item(item_id):
    """Exclui um item do estoque"""
    item = Item.query.get_or_404(item_id)
    
    # Verifica se há movimentações associadas
    if item.movimentacoes:
        return jsonify({'erro': 'Não é possível excluir item com movimentações registradas'}), 400
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'mensagem': 'Item excluído com sucesso'})
