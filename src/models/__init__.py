from flask_sqlalchemy import SQLAlchemy

# Inicialização do SQLAlchemy
db = SQLAlchemy()

# Função para inicializar os modelos
def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

# Importando os modelos após a definição de db para evitar importação circular
from src.models.item import Item
from src.models.local import Local
from src.models.movimentacao import Movimentacao, TipoMovimentacao
