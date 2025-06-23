from flask_sqlalchemy import SQLAlchemy
from src.models import db
from datetime import datetime

class Local(db.Model):
    """Modelo para locais de armazenamento (andares e banheiros)"""
    __tablename__ = 'locais'
    
    id = db.Column(db.Integer, primary_key=True)
    andar = db.Column(db.Integer, nullable=False)  # 1, 2, 3, 4, 5
    tipo_banheiro = db.Column(db.String(20), nullable=False)  # 'masculino', 'feminino'
    descricao = db.Column(db.String(100), nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.now)
    data_atualizacao = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relacionamentos
    movimentacoes = db.relationship('Movimentacao', backref='local', lazy=True)
    
    def __repr__(self):
        return f'<Local {self.id}: Andar {self.andar} - {self.tipo_banheiro}>'
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'andar': self.andar,
            'tipo_banheiro': self.tipo_banheiro,
            'descricao': self.descricao,
            'data_criacao': self.data_criacao.strftime('%d/%m/%Y %H:%M:%S') if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.strftime('%d/%m/%Y %H:%M:%S') if self.data_atualizacao else None
        }
