from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = "data/users.json"

# Crear archivo si no existe
os.makedirs("data", exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

@app.route("/register", methods=["POST"])
def register():
    new_user = request.get_json()
    with open(DATA_FILE, "r+") as f:
        users = json.load(f)
        if any(u["email"] == new_user["email"] for u in users):
            return jsonify({"error": "El correo ya está registrado"}), 400
        users.append(new_user)
        f.seek(0)
        json.dump(users, f, indent=2)
    return jsonify({"message": "Registro exitoso"}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    with open(DATA_FILE, "r") as f:
        users = json.load(f)
    for u in users:
        if u["email"] == data["email"] and u["password"] == data["password"]:
            return jsonify({"message": "Login correcto"}), 200
    return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

if __name__ == "__main__":
    app.run(debug=True)
