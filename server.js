const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "cyberguard"
});

db.connect((err) => {
if (err) {
console.log("Database Error:", err);
} else {
console.log("MySQL Connected");
}
});

// Gmail Configuration
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: "kalpeshmorajkar01@gmail.com",
pass: "dxuibuegethtjsnq"
}
});

// Save Scan
app.post("/save-scan", async (req, res) => {

const { name, email, url, security_percentage } = req.body;

let status = "Safe URL ✅";

if (security_percentage < 50) {
    status = "Dangerous URL 🚨";
} else if (security_percentage < 95) {
    status = "Warning URL ⚠️";
}

db.query(
    "INSERT INTO scan_history(name,email,url,status,security_percentage) VALUES(?,?,?,?,?)",
    [name, email, url, status, security_percentage],
    async (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        // Send Email for Dangerous URLs
        if (security_percentage < 50) {

            try {

                await transporter.sendMail({
                    from: "kalpeshmorajkar01@gmail.com",
                    to: email,
                    subject: "🚨 CyberGuard Alert",
                    html: `
                        <h2>Dangerous URL Detected</h2>

                        <p>Hello ${name},</p>

                        <p>The URL you scanned appears dangerous.</p>

                        <p><b>URL:</b> ${url}</p>
                        <p><b>Status:</b> ${status}</p>
                        <p><b>Security Score:</b> ${security_percentage}%</p>

                        <hr>

                        <p>Please avoid opening this URL.</p>
                    `
                });

                console.log("Email Sent To:", email);

            } catch (error) {

                console.log("Email Error:", error);

            }
        }

        res.json({
            success: true,
            status: status,
            security_percentage: security_percentage
        });

    }
);

});

// History
app.get("/history", (req, res) => {

db.query(
    "SELECT * FROM scan_history ORDER BY id DESC",
    (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    }
);

});

// Stats
app.get("/stats", (req, res) => {

db.query(
    "SELECT COUNT(*) AS totalScans FROM scan_history",
    (err, total) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            totalScans: total[0].totalScans
        });

    }
);

});

app.listen(5000, () => {
console.log("Server Running On Port 5000");
});