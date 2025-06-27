from flask_sqlalchemy import SQLAlchemy
from src.models import db
from datetime import datetime
from enum import Enum

class TipoMovimentacao(Enum):
    ENTRADA = 'entrada'
    SAIDA = 'saida'
    DESPERDICIO = 'desperdicio'  # Novo tipo para desperdício

class Movimentacao(db.Model):
    """Modelo para as movimentações de entrada, saída e desperdício no estoque"""
    __tablename__ = 'movimentacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(15), nullable=False)  # 'entrada', 'saida' ou 'desperdicio'
    quantidade = db.Column(db.Integer, nullable=False)
    data_movimentacao = db.Column(db.DateTime, default=datetime.now)
    motivo = db.Column(db.String(200), nullable=True)
    documento = db.Column(db.String(50), nullable=True)  # Número de nota fiscal, requisição, etc.
    responsavel = db.Column(db.String(100), nullable=True)
    observacao = db.Column(db.Text, nullable=True)
    
    # Relacionamentos
    item_id = db.Column(db.Integer, db.ForeignKey('itens.id'), nullable=False)
    item = db.relationship('Item', backref='movimentacoes')
    
    # Relacionamento opcional com local de origem/destino
    local_origem_id = db.Column(db.Integer, db.ForeignKey('locais.id'), nullable=True)
    local_destino_id = db.Column(db.Integer, db.ForeignKey('locais.id'), nullable=True)
    
    # Renomeando os relacionamentos para evitar conflitos
    origem = db.relationship('Local', foreign_keys=[local_origem_id])
    destino = db.relationship('Local', foreign_keys=[local_destino_id])
    
    def __repr__(self):
        return f'<Movimentacao {self.tipo} de {self.quantidade} unidades do item {self.item_id}>'
