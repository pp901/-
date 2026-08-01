"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const COUNTER_FILE = path.join(__dirname, "counter.json");
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg":  "image/svg+xml",
    ".webp": "image/webp",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".ico":  "image/x-icon",
    ".md":   "text/plain; charset=utf-8",
};

function loadCounter() {
    try {
        return JSON.parse(fs.readFileSync(COUNTER_FILE, "utf-8"));
    } catch {
        return { total: 0, today: 0, date: "", visitors: {} };
    }
}

function saveCounter(data) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(data), "utf-8");
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function getClientId(req) {
    return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")
        .split(",")[0].trim();
}

function serveStatic(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    /* -------- Counter API -------- */
    if (pathname === "/api/counter") {
        if (req.method === "POST") {
            const data = loadCounter();
            const key = todayKey();
            const client = getClientId(req);
            const visitorKey = `${client}::${key}`;

            if (key !== data.date) {
                data.date = key;
                data.today = 0;
            }

            if (!data.visitors[visitorKey]) {
                data.visitors[visitorKey] = true;
                data.total += 1;
                data.today += 1;
            }

            saveCounter(data);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ total: data.total, today: data.today }));
            return;
        }

        const data = loadCounter();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ total: data.total, today: data.today }));
        return;
    }

    /* -------- Static files -------- */
    let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
    filePath = path.normalize(filePath);

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            filePath = path.join(__dirname, "index.html");
        }
        serveStatic(res, filePath);
    });
});

server.listen(PORT, () => {
    console.log(`信火追源 running at http://localhost:${PORT}`);
});
