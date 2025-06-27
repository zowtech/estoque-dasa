import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from src.models import db, init_db
from src.routes import register_routes

app = Flask(__name__)

# Configuração CORS para permitir requisições do frontend
CORS(app)

# Configuração do banco de dados - usando SQLite para simplificar
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///estoque_banheiros.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configurações para produção
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Inicializa o banco de dados
init_db(app)

# Registra os blueprints
register_routes(app)

# Rota para a página inicial
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

# Rota para arquivos estáticos
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# ROTA TEMPORÁRIA PARA POPULAR O BANCO NO RENDER
# Remova após popular os dados!
@app.route('/popular-dados')
def popular_dados():
    import popular_banco
    return 'Banco populado com dados fictícios! (Remova esta rota após o uso por segurança)'

if __name__ == '__main__':
    # Para desenvolvimento local
    app.run(host='0.0.0.0', port=5000, debug=True)
else:
    # Para produção (Render)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

