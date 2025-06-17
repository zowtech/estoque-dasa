import os

content = """
from flask import Blueprint
from src.routes.item import item_bp
from src.routes.local import local_bp
from src.routes.movimentacao import movimentacao_bp
from src.routes.dashboard import dashboard_bp
from src.routes.eventos import eventos_bp
from src.routes.relatorios import relatorios_bp

def register_routes(app):
    app.register_blueprint(item_bp, url_prefix="/api/itens")
    app.register_blueprint(local_bp, url_prefix="/api/locais")
    app.register_blueprint(movimentacao_bp, url_prefix="/api/movimentacoes")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(eventos_bp, url_prefix="/api/eventos")
    app.register_blueprint(relatorios_bp, url_prefix="/api/relatorios")
"""

file_path = "/home/ubuntu/sistema_estoque/estoque/src/routes/__init__.py"

# Ensure the directory exists
os.makedirs(os.path.dirname(file_path), exist_ok=True)

with open(file_path, "w") as f:
    f.write(content.strip())


