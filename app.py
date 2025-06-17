
from flask import Flask, render_template, redirect, url_for, request, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user

app = Flask(__name__)
app.secret_key = 'chave-secreta'
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id):
        self.id = id

users = {'admin': {'password': 'admin'}}

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username]['password'] == password:
            user = User(username)
            login_user(user)
            return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/produtos')
@login_required
def produtos():
    return render_template('produtos.html')

@app.route('/movimentacoes')
@login_required
def movimentacoes():
    return render_template('movimentacoes.html')

@app.route('/dados')
def dados():
    return jsonify({
        "labels": ["Seg", "Ter", "Qua", "Qui", "Sex"],
        "valores": [10, 20, 15, 30, 25]
    })

if __name__ == "__main__":
    app.run(debug=True)
