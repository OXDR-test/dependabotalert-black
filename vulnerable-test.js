const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// Hardcoded secret
const API_KEY = "API_KEY_REDACTED";

// Hardcoded DB credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'testdb'
});

// SQL Injection vulnerability
app.get('/user', (req, res) => {

    const userId = req.query.id;

    const query = "SELECT * FROM users WHERE id = '" + userId + "'";

    db.query(query, (err, result) => {

        if (err) {
            return res.send(err);
        }

        res.json(result);
    });
});

// Command Injection vulnerability
app.get('/ping', (req, res) => {

    const host = req.query.host;

    require('child_process').exec(
        'ping -c 1 ' + host,
        (err, stdout) => {

            if (err) {
                return res.send(err);
            }

            res.send(stdout);
        }
    );
});

// Weak authentication
app.get('/admin', (req, res) => {

    const token = req.headers.authorization;

    if (token == 'admin') {
        res.send('Welcome Admin');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
