from flask_sqlalchemy import SQLAlchemy
from src.models import db
from datetime import datetime

class Evento(db.Model):
    """Modelo para eventos e anotações no calendário"""
    __tablename__ = 'eventos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data = db.Column(db.DateTime, nullable=False)
    tipo = db.Column(db.String(50), nullable=False, default='outro')  # 'reforma', 'apresentacao', 'manutencao', 'outro'
    data_criacao = db.Column(db.DateTime, default=datetime.now)
    data_atualizacao = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def __repr__(self):
        return f'<Evento {self.id}: {self.titulo} ({self.data.strftime("%d/%m/%Y")})>'
    
    def to_dict(self):
        """Converte o objeto para dicionário"""
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'data': self.data.strftime('%Y-%m-%d'),
            'tipo': self.tipo,
            'data_criacao': self.data_criacao.strftime('%d/%m/%Y %H:%M:%S') if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.strftime('%d/%m/%Y %H:%M:%S') if self.data_atualizacao else None
        }
