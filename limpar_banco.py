import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models import db, Item, Local, Movimentacao, Evento, User
from src.main import app

def limpar_banco():
    """Remove todos os dados do banco e recria as tabelas"""
    with app.app_context():
        # Remove todas as tabelas
        db.drop_all()
        
        # Recria as tabelas
        db.create_all()
        
        print("✅ Banco de dados limpo e recriado com sucesso!")
        print("📋 Tabelas criadas: Item, Local, Movimentacao, Evento, User")
        print("🎯 Sistema pronto para receber dados reais!")

if __name__ == '__main__':
    limpar_banco()

