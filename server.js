const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
//connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'loan_management'
});
db.connect(err => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});
//apply
app.post('/apply-loan', (req, res) => {
    const { user_name, loan_type, amount, interest, months, emi } = req.body;

    const sql = `
    INSERT INTO loans (user_name, loan_type, amount, interest, months, emi, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending')
  `;

    db.query(sql, [user_name, loan_type, amount, interest, months, emi], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Loan Applied Successfully");
    });
});
//get user loan
app.get('/user-loans/:name', (req, res) => {
    const name = req.params.name;

    const sql = `SELECT * FROM loans WHERE user_name = ?`;

    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


//Get All Loans (Admin)
app.get('/all-loans', (req, res) => {
    db.query("SELECT * FROM loans", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


//Update Loan Status
app.post('/update-status', (req, res) => {
    const { loan_id, status } = req.body;

    const sql = `UPDATE loans SET status = ? WHERE loan_id = ?`;

    db.query(sql, [status, loan_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Status Updated");
    });
});


//Make Payment
app.post('/make-payment', (req, res) => {
    const { loan_id, user_name, amount } = req.body;

    const sql = `
    INSERT INTO payments (loan_id, user_name, amount, payment_date)
    VALUES (?, ?, ?, CURDATE())
  `;

    db.query(sql, [loan_id, user_name, amount], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Payment Successful");
    });
});


//Get Payments
app.get('/payments/:name', (req, res) => {
    const name = req.params.name;

    const sql = `SELECT * FROM payments WHERE user_name = ?`;

    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
//start
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});