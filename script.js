const scanBtn = document.getElementById("scanBtn");
const result = document.getElementById("result");
const historyBody = document.getElementById("historyBody");
const totalScans = document.getElementById("totalScans");

scanBtn.addEventListener("click", async () => {

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const url = document.getElementById("url").value.trim();

if (!name || !email || !url) {
    alert("Please fill all fields");
    return;
}

let score = 100;

// URL Validation
try {
    new URL(url);
} catch {
    score = 0;
}

// Security Checks
if (!url.startsWith("https://")) {
    score -= 20;
}

if (url.includes("@")) {
    score -= 20;
}

if (url.includes("bit.ly")) {
    score -= 15;
}

if (url.includes("tinyurl")) {
    score -= 15;
}

if (url.length > 80) {
    score -= 10;
}

const suspiciousWords = [
    "login",
    "verify",
    "update",
    "banking",
    "password",
    "signin",
    "gift",
    "free"
];

suspiciousWords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
        score -= 10;
    }
});

if (score < 0) {
    score = 0;
}

let status = "";

if (score >= 95) {
    status = "Safe URL ✅";
    result.className = "safe";
}
else if (score >= 50) {
    status = "Warning URL ⚠️";
    result.className = "warning";
}
else {
    status = "Dangerous URL 🚨";
    result.className = "danger";
}

result.innerHTML = `
    <h3>${status}</h3>
    <h2>Security Score: ${score}%</h2>
`;

try {

    await fetch("http://localhost:5000/save-scan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            url,
            security_percentage: score
        })
    });

    loadHistory();
    loadStats();

} catch (error) {

    console.log("Error:", error);

}

});

async function loadHistory() {

try {

    const response = await fetch("http://localhost:5000/history");
    const data = await response.json();

    historyBody.innerHTML = "";

    data.forEach(item => {

        historyBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.url}</td>
                <td>${item.status}</td>
                <td>${item.security_percentage}%</td>
            </tr>
        `;

    });

} catch (error) {

    console.log(error);

}

}

async function loadStats() {

try {

    const response = await fetch("http://localhost:5000/stats");
    const data = await response.json();

    totalScans.innerText = data.totalScans;

} catch (error) {

    console.log(error);

}

}

loadHistory();
loadStats();