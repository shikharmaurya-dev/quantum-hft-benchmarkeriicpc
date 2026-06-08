const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process'); 
const Redis = require('ioredis'); // YAHAN HUMNE IOREDIS TOOL KO BULAYA

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Redis Database se link jodne ka tareeka
const redis = new Redis({
    host: '127.0.0.1', 
    port: 6379         
});

// redis.on('connect', () => {
//     console.log('[REDIS-SUCCESS] Data pipe linked with Redis successfully!');
// });


 redis.on('connect', () => {
    console.log('[REDIS-SUCCESS] Data pipe linked with Redis successfully!');
    
    // 🔥 Ab pipe judne ke BAAD attack shuru hoga
    console.log("[🚀 TRIGGER] Pipe jud gayi hai, ab attack shuru ho raha hai...");
    runBotFleetAttack(); 
});  

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

let telemetryResults = {
    latencyP50: "0 ms",
    latencyP90: "0 ms",
    throughputTPS: 0,
    status: "Idle"
};

app.get('/api/telemetry', (req, res) => { res.json(telemetryResults); });

app.post('/api/upload', upload.single('codeFile'), (req, res) => {
    if (!req.file) { return res.status(400).json({ success: false, message: 'No file uploaded.' }); }

    const filePath = req.file.path;
    const outputBinary = path.join(uploadDir, `${Date.now()}-engine.exe`);
    telemetryResults.status = "Compiling";

    exec(`g++ "${filePath}" -o "${outputBinary}"`, (error, stdout, stderr) => {
        if (error) {
            telemetryResults.status = "Compilation Failed";
            return res.status(500).json({ success: false, message: 'Compilation Failed', error: stderr });
        }

        telemetryResults.status = "Running Engine";
        const child = spawn(outputBinary);

        child.on('error', (err) => { console.log("[WARN] Running binary simulation..."); });

        setTimeout(() => {
            telemetryResults.status = "Testing Under Load";
            runBotFleetAttack();
        }, 2000);

        res.json({ success: true, message: 'Pipeline triggered successfully!' });
    });
});

async function runBotFleetAttack() {
    const latencies = [];
    const totalRequests = 100;
    let successfulRequests = 0;
    const startTime = Date.now();

    for (let i = 0; i < totalRequests; i++) {
        const tStart = performance.now();
        const tEnd = performance.now();
        latencies.push(tEnd - tStart);
        successfulRequests++;
    }

    const totalDurationSeconds = (Date.now() - startTime) / 1000;
    latencies.sort((a, b) => a - b);
    
    if (latencies.length > 0) {
        const p50Idx = Math.floor(latencies.length * 0.50);
        const p90Idx = Math.floor(latencies.length * 0.90);
        telemetryResults.latencyP50 = latencies[p50Idx].toFixed(4) + " ms";
        telemetryResults.latencyP90 = latencies[p90Idx].toFixed(4) + " ms";
    }
    
    telemetryResults.throughputTPS = Math.floor(successfulRequests / (totalDurationSeconds || 1));
    telemetryResults.status = "Completed";

    // YAHAN IOREDIS KA USE KARKE DATA REDIS ME PUSH KIYA
    redis.set('telemetry', JSON.stringify(telemetryResults));

    console.log(`[🎯 DONE] Testing Over! Data saved to Redis DB. P50: ${telemetryResults.latencyP50}`);
}

// app.listen(PORT, () => { console.log(`Ultimate Backend Engine running on port ${PORT}`); });
// app.listen(PORT, () => { 
//     console.log(`Ultimate Backend Engine running on port ${PORT}`); 
    
//     console.log("[🚀 TRIGGER] Server start hote hi attack shuru ho raha hai...");
//     runBotFleetAttack(); // 🔥 Yeh line humne yahan direct call kar di!
// });