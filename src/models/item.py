from flask_sqlalchemy import SQLAlchemy
from src.models import db
from datetime import datetime

class Item(db.Model):
    """Modelo para itens do estoque"""
    __tablename__ = 'itens'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(20), unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    quantidade = db.Column(db.Integer, default=0)
    preco_unitario = db.Column(db.Numeric(10, 2), nullable=True)
    
    # Novos campos para controle de produtos de banheiro
    categoria = db.Column(db.String(50), nullable=True)  # 'papel higiênico', 'sabonete', etc.
    unidade_medida = db.Column(db.String(20), nullable=True)  # 'rolo', 'litro', etc.
    tamanho = db.Column(db.String(20), nullable=True)  # 'pequeno', 'médio', 'grande'
    
    local_id = db.Column(db.Integer, db.ForeignKey('locais.id'), nullable=True)
    data_cadastro = db.Column(db.DateTime, default=datetime.now)
    data_atualizacao = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relacionamentos serão definidos após a declaração de todas as classes
    # para evitar problemas de referência circular
    
    def __repr__(self):
        return f'<Item {self.codigo} - {self.nome}>'
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'codigo': self.codigo,
            'nome': self.nome,
            'descricao': self.descricao,
            'quantidade': self.quantidade,
            'preco_unitario': float(self.preco_unitario) if self.preco_unitario else None,
            'categoria': self.categoria,
            'unidade_medida': self.unidade_medida,
            'tamanho': self.tamanho,
            'local_id': self.local_id,
            'local': self.local.nome if self.local else None,
            'data_cadastro': self.data_cadastro.strftime('%d/%m/%Y %H:%M:%S') if self.data_cadastro else None,
            'data_atualizacao': self.data_atualizacao.strftime('%d/%m/%Y %H:%M:%S') if self.data_atualizacao else None
        }
