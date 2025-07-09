const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path"); // 👉 Add this line
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👉 Serve frontend HTML and assets from ../frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/signup", (req, res) => {
  const { name, mobile, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }
  const sql = "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, mobile, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Signup Successful",
      text: `Welcome ${name}, your account has been created successfully.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ msg: "Signup success but email failed" });
      res.status(200).json({ msg: "Signup success. Email sent." });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      res.status(200).json({ msg: "Login successful" });
    } else {
      res.status(401).json({ msg: "Invalid credentials" });
    }
  });
});

// 👉 Default route to send index.html when visiting http://localhost:3000
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
