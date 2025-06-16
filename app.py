from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

users = {
    "admin": {"password": generate_password_hash("admin123")}
}

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    if user_id in users:
        return User(user_id)
    return None

@app.route("/")
def home():
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = users.get(username)
        if user and check_password_hash(user["password"], password):
            login_user(User(username))
            return redirect(url_for("dashboard"))
        flash("Usuário ou senha inválidos.")
    return render_template("login.html")

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

@app.route("/dados")
@login_required
def dados():
    produtos = [
        {"nome": "Sabonete", "quantidade": 120, "categoria": "Higiene"},
        {"nome": "Papel Higiênico", "quantidade": 200, "categoria": "Higiene"},
        {"nome": "Detergente", "quantidade": 75, "categoria": "Limpeza"},
        {"nome": "Álcool Gel", "quantidade": 50, "categoria": "Higiene"},
        {"nome": "Desinfetante", "quantidade": 90, "categoria": "Limpeza"},
    ]
    return jsonify(produtos)

if __name__ == "__main__":
    app.run(debug=True)
