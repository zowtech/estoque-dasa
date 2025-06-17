from flask import Blueprint, request, jsonify
from src.models import db, Local

local_bp = Blueprint('local', __name__)

@local_bp.route('/', methods=['GET'])
def listar_locais():
    """Lista todos os locais de armazenamento"""
    locais = Local.query.all()
    resultado = []
    
    for local in locais:
        resultado.append({
            'id': local.id,
            'codigo': local.codigo,
            'nome': local.nome,
            'descricao': local.descricao,
            'capacidade': local.capacidade,
            'data_cadastro': local.data_cadastro.strftime('%d/%m/%Y %H:%M'),
            'data_atualizacao': local.data_atualizacao.strftime('%d/%m/%Y %H:%M')
        })
    
    return jsonify(resultado)

@local_bp.route('/<int:local_id>', methods=['GET'])
def obter_local(local_id):
    """Obtém detalhes de um local específico"""
    local = Local.query.get_or_404(local_id)
    
    resultado = {
        'id': local.id,
        'codigo': local.codigo,
        'nome': local.nome,
        'descricao': local.descricao,
        'capacidade': local.capacidade,
        'data_cadastro': local.data_cadastro.strftime('%d/%m/%Y %H:%M'),
        'data_atualizacao': local.data_atualizacao.strftime('%d/%m/%Y %H:%M')
    }
    
    return jsonify(resultado)

@local_bp.route('/', methods=['POST'])
def criar_local():
    """Cria um novo local de armazenamento"""
    dados = request.json
    
    # Validação básica
    if not dados.get('codigo') or not dados.get('nome'):
        return jsonify({'erro': 'Código e nome são obrigatórios'}), 400
    
    # Verifica se o código já existe
    if Local.query.filter_by(codigo=dados['codigo']).first():
        return jsonify({'erro': 'Código já cadastrado'}), 400
    
    novo_local = Local(
        codigo=dados['codigo'],
        nome=dados['nome'],
        descricao=dados.get('descricao'),
        capacidade=dados.get('capacidade')
    )
    
    db.session.add(novo_local)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Local cadastrado com sucesso',
        'id': novo_local.id
    }), 201

@local_bp.route('/<int:local_id>', methods=['PUT'])
def atualizar_local(local_id):
    """Atualiza um local existente"""
    local = Local.query.get_or_404(local_id)
    dados = request.json
    
    # Atualiza os campos
    if 'nome' in dados:
        local.nome = dados['nome']
    if 'descricao' in dados:
        local.descricao = dados['descricao']
    if 'capacidade' in dados:
        local.capacidade = dados['capacidade']
    
    db.session.commit()
    
    return jsonify({'mensagem': 'Local atualizado com sucesso'})

@local_bp.route('/<int:local_id>', methods=['DELETE'])
def excluir_local(local_id):
    """Exclui um local de armazenamento"""
    local = Local.query.get_or_404(local_id)
    
    # Verifica se há itens associados
    if local.itens:
        return jsonify({'erro': 'Não é possível excluir local com itens associados'}), 400
    
    db.session.delete(local)
    db.session.commit()
    
    return jsonify({'mensagem': 'Local excluído com sucesso'})
