from flask import Flask, request
import os
import sqlite3
import subprocess
import hashlib
import random
import jwt
import pickle

app = Flask(__name__)

# Hardcoded secrets
SECRET_KEY = "my-super-secret-key"
AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_KEY = "aws-secret-key-example"
DB_PASSWORD = "password123"

# Weak hashing
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# Predictable token generation
def generate_reset_code():
    return str(random.randint(1000, 9999))

# SQL Injection vulnerability
@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"

    cursor.execute(query)

    result = cursor.fetchall()

    return str(result)

# Command Injection vulnerability
@app.route('/ping')
def ping():
    host = request.args.get('host')

    output = subprocess.getoutput("ping -c 1 " + host)

    return output

# Path Traversal vulnerability
@app.route('/read')
def read_file():
    filename = request.args.get('file')

    with open(filename, 'r') as f:
        data = f.read()

    return data

# JWT without expiry
@app.route('/token')
def token():
    token = jwt.encode(
        {"user": "admin"},
        SECRET_KEY,
        algorithm="HS256"
    )

    return token

# Unsafe deserialization
@app.route('/deserialize', methods=['POST'])
def deserialize():
    data = request.data

    obj = pickle.loads(data)

    return str(obj)

# Sensitive data exposure
@app.route('/env')
def env():
    return str(os.environ)

# Debug enabled
if __name__ == '__main__':
    app.run(debug=True)
