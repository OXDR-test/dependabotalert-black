
const express = require('express');
const mysql = require('mysql');
const crypto = require('crypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Hardcoded secrets
const DB_PASSWORD = "root123";
const JWT_SECRET = "super-secret-jwt-key";
const API_KEY = "API_KEY_REDACTED";
const AWS_SECRET = "aws-secret-access-key";

// Weak crypto
function weakHash(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

// Insecure random token
function generateToken() {
    return Math.random().toString(36);
}

// Hardcoded DB connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD,
    database: 'users'
});

// SQL Injection vulnerability
app.get('/user', (req, res) => {
    const id = req.query.id;

    const query = "SELECT * FROM users WHERE id = " + id;

    connection.query(query, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
});

// Command Injection
app.get('/ping', (req, res) => {
    const ip = req.query.ip;

    require('child_process').exec('ping -c 1 ' + ip, (err, stdout) => {
        if (err) {
            return res.send(err);
        }

        res.send(stdout);
    });
});

// Path Traversal
app.get('/read-file', (req, res) => {
    const file = req.query.file;

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return res.send(err);
        }

        res.send(data);
    });
});

// JWT without expiration
app.post('/login', (req, res) => {
    const username = req.body.username;

    const token = jwt.sign(
        { username: username },
        JWT_SECRET
    );

    res.json({ token });
});

// Sensitive logging
app.post('/register', (req, res) => {
    console.log("User Password:", req.body.password);

    res.send("Registered");
});

// Open CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Unsafe eval
app.post('/calculate', (req, res) => {
    const expression = req.body.expression;

    const result = eval(expression);

    res.send(result.toString());
});

// Weak authentication check
app.get('/admin', (req, res) => {
    const token = req.headers.authorization;

    if (token == "admin") {
        res.send("Welcome Admin");
    } else {
        res.status(401).send("Unauthorized");
    }
});

// Insecure deserialization simulation
app.post('/deserialize', (req, res) => {
    const data = req.body.data;

    const obj = JSON.parse(data);

    res.json(obj);
});

// Exposed environment variable
app.get('/env', (req, res) => {
    res.json(process.env);
});

// Start app
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
