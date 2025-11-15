// server.js
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.raw({ limit: '100mb', type: 'application/octet-stream' }));

// Serve static HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Test Pro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 2em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9em;
        }
        .speed-display {
            text-align: center;
            margin: 30px 0;
        }
        .speed-value {
            font-size: 3.5em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
            font-variant-numeric: tabular-nums;
        }
        .speed-label {
            color: #666;
            font-size: 1.2em;
        }
        .results {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .result-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .result-value {
            font-size: 1.3em;
            font-weight: bold;
            color: #764ba2;
            margin: 5px 0;
            font-variant-numeric: tabular-nums;
        }
        .result-label {
            color: #666;
            font-size: 0.85em;
        }
        button {
            width: 100%;
            padding: 15px;
            font-size: 1.2em;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }
        .start-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .start-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .start-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .status {
            text-align: center;
            color: #666;
            margin: 15px 0;
            font-style: italic;
            min-height: 20px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s;
        }
        .stats {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 0.85em;
            color: #666;
        }
        .stats-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Speed Test Pro</h1>
        <div class="subtitle">Kiểm tra tốc độ mạng chính xác cao</div>
        
        <div class="speed-display">
            <div class="speed-label">Download Speed</div>
            <div class="speed-value" id="downloadSpeed">0.00</div>
            <div class="speed-label">Mbps</div>
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
        </div>

        <div class="results">
            <div class="result-box">
                <div class="result-label">Upload</div>
                <div class="result-value" id="uploadSpeed">0.00</div>
                <div class="result-label" style="font-size: 0.75em;">Mbps</div>
            </div>
            <div class="result-box">
                <div class="result-label">Ping</div>
                <div class="result-value" id="ping">0</div>
                <div class="result-label" style="font-size: 0.75em;">ms</div>
            </div>
            <div class="result-box">
                <div class="result-label">Jitter</div>
                <div class="result-value" id="jitter">0</div>
                <div class="result-label" style="font-size: 0.75em;">ms</div>
            </div>
        </div>

        <div class="status" id="status">Nhấn Start để bắt đầu kiểm tra</div>
        
        <button class="start-btn" id="startBtn" onclick="startTest()">
            Start Test
        </button>

        <div class="stats" id="stats" style="display: none;">
            <div class="stats-row">
                <span>Số lần test:</span>
                <span id="iterations">-</span>
            </div>
            <div class="stats-row">
                <span>Dữ liệu tải xuống:</span>
                <span id="dataDown">-</span>
            </div>
            <div class="stats-row">
                <span>Dữ liệu tải lên:</span>
                <span id="dataUp">-</span>
            </div>
            <div class="stats-row">
                <span>Thời gian test:</span>
                <span id="testTime">-</span>
            </div>
        </div>
    </div>

    <script>
        let isRunning = false;
        const API_URL = window.location.origin; // Tự động detect server URL

        async function startTest() {
            if (isRunning) return;
            
            isRunning = true;
            const btn = document.getElementById('startBtn');
            btn.disabled = true;
            btn.textContent = 'Testing...';
            
            document.getElementById('downloadSpeed').textContent = '0.00';
            document.getElementById('uploadSpeed').textContent = '0.00';
            document.getElementById('ping').textContent = '0';
            document.getElementById('jitter').textContent = '0';
            document.getElementById('stats').style.display = 'none';
            
            const startTime = Date.now();
            let totalDownload = 0;
            let totalUpload = 0;
            let iterations = 0;

            try {
                const pingResults = await testPing();
                iterations++;
                
                const downloadResults = await testDownload();
                totalDownload = downloadResults.totalBytes;
                iterations += downloadResults.iterations;
                
                const uploadResults = await testUpload();
                totalUpload = uploadResults.totalBytes;
                iterations += uploadResults.iterations;
                
                const endTime = Date.now();
                const totalTime = ((endTime - startTime) / 1000).toFixed(1);

                document.getElementById('status').textContent = 'Kiểm tra hoàn tất!';
                document.getElementById('stats').style.display = 'block';
                document.getElementById('iterations').textContent = iterations;
                document.getElementById('dataDown').textContent = (totalDownload / (1024 * 1024)).toFixed(2) + ' MB';
                document.getElementById('dataUp').textContent = (totalUpload / (1024 * 1024)).toFixed(2) + ' MB';
                document.getElementById('testTime').textContent = totalTime + 's';
                
            } catch (error) {
                document.getElementById('status').textContent = 'Lỗi: ' + error.message;
                console.error(error);
            }
            
            btn.disabled = false;
            btn.textContent = 'Test Again';
            isRunning = false;
        }

        async function testPing() {
            document.getElementById('status').textContent = 'Đang kiểm tra ping và jitter...';
            document.getElementById('progress').style.width = '10%';
            
            const iterations = 10; // Tăng số lần test
            const pings = [];

            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                await fetch(API_URL + '/ping?t=' + Date.now());
                const end = performance.now();
                pings.push(end - start);
                await new Promise(resolve => setTimeout(resolve, 100)); // Delay giữa các ping
            }

            // Loại bỏ outliers (20% giá trị cao nhất và thấp nhất)
            pings.sort((a, b) => a - b);
            const trimCount = Math.floor(iterations * 0.2);
            const trimmedPings = pings.slice(trimCount, iterations - trimCount);

            const avgPing = Math.round(trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length);
            
            // Tính jitter (độ biến động ping)
            let jitterSum = 0;
            for (let i = 1; i < trimmedPings.length; i++) {
                jitterSum += Math.abs(trimmedPings[i] - trimmedPings[i - 1]);
            }
            const jitter = Math.round(jitterSum / (trimmedPings.length - 1));

            document.getElementById('ping').textContent = avgPing;
            document.getElementById('jitter').textContent = jitter;
            
            return { avgPing, jitter };
        }

        async function testDownload() {
            document.getElementById('status').textContent = 'Đang kiểm tra tốc độ download...';
            
            // Test với nhiều kích thước file khác nhau
            const sizes = [1, 2, 5, 10, 20]; // MB
            const speeds = [];
            let totalBytes = 0;
            let maxSpeed = 0;

            for (let i = 0; i < sizes.length; i++) {
                const size = sizes[i];
                const progress = 10 + ((i + 1) / sizes.length) * 40;
                document.getElementById('progress').style.width = progress + '%';

                // Test mỗi size 2 lần để tăng độ chính xác
                for (let j = 0; j < 2; j++) {
                    const start = performance.now();
                    const response = await fetch(API_URL + '/download?size=' + size + '&t=' + Date.now());
                    const data = await response.arrayBuffer();
                    const end = performance.now();

                    const duration = (end - start) / 1000; // seconds
                    const bytes = data.byteLength;
                    totalBytes += bytes;
                    const bits = bytes * 8;
                    const speedMbps = (bits / duration / 1000000);
                    
                    speeds.push(speedMbps);
                    
                    if (speedMbps > maxSpeed) {
                        maxSpeed = speedMbps;
                        document.getElementById('downloadSpeed').textContent = speedMbps.toFixed(2);
                    }
                    
                    // Delay nhỏ giữa các test
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // Tính tốc độ trung bình (loại bỏ outliers)
            speeds.sort((a, b) => a - b);
            const trimCount = Math.floor(speeds.length * 0.2);
            const trimmedSpeeds = speeds.slice(trimCount, speeds.length - trimCount);
            const avgSpeed = trimmedSpeeds.reduce((a, b) => a + b, 0) / trimmedSpeeds.length;
            
            document.getElementById('downloadSpeed').textContent = avgSpeed.toFixed(2);

            return { 
                avgSpeed, 
                maxSpeed, 
                totalBytes,
                iterations: sizes.length * 2 
            };
        }

        async function testUpload() {
            document.getElementById('status').textContent = 'Đang kiểm tra tốc độ upload...';
            
            const sizes = [0.5, 1, 2, 5, 10]; // MB
            const speeds = [];
            let totalBytes = 0;
            let maxSpeed = 0;

            for (let i = 0; i < sizes.length; i++) {
                const size = sizes[i];
                const progress = 50 + ((i + 1) / sizes.length) * 45;
                document.getElementById('progress').style.width = progress + '%';

                // Test mỗi size 2 lần
                for (let j = 0; j < 2; j++) {
                    const bytes = size * 1024 * 1024;
                    const data = new Uint8Array(bytes);
                    
                    // Fill với random data
                    for (let k = 0; k < bytes; k++) {
                        data[k] = Math.random() * 256;
                    }
                    
                    const start = performance.now();
                    await fetch(API_URL + '/upload', {
                        method: 'POST',
                        body: data.buffer,
                        headers: {
                            'Content-Type': 'application/octet-stream'
                        }
                    });
                    const end = performance.now();

                    const duration = (end - start) / 1000;
                    totalBytes += bytes;
                    const bits = bytes * 8;
                    const speedMbps = (bits / duration / 1000000);
                    
                    speeds.push(speedMbps);
                    
                    if (speedMbps > maxSpeed) {
                        maxSpeed = speedMbps;
                        document.getElementById('uploadSpeed').textContent = speedMbps.toFixed(2);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // Tính tốc độ trung bình (loại bỏ outliers)
            speeds.sort((a, b) => a - b);
            const trimCount = Math.floor(speeds.length * 0.2);
            const trimmedSpeeds = speeds.slice(trimCount, speeds.length - trimCount);
            const avgSpeed = trimmedSpeeds.reduce((a, b) => a + b, 0) / trimmedSpeeds.length;
            
            document.getElementById('uploadSpeed').textContent = avgSpeed.toFixed(2);
            document.getElementById('progress').style.width = '100%';

            return { 
                avgSpeed, 
                maxSpeed, 
                totalBytes,
                iterations: sizes.length * 2 
            };
        }
    </script>
</body>
</html>
  `);
});

// Ping endpoint với cache prevention
app.get('/ping', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json({ 
    timestamp: Date.now(),
    server: 'speedtest-v2' 
  });
});

// Download endpoint - generates random data with cache prevention
app.get('/download', (req, res) => {
  const size = parseInt(req.query.size) || 1;
  const bytes = size * 1024 * 1024;
  
  // Generate compressible random data for realistic test
  const data = crypto.randomBytes(bytes);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', bytes);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(data);
});

// Upload endpoint with detailed response
app.post('/upload', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ 
    received: req.body.length,
    timestamp: Date.now(),
    status: 'success'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(\`🚀 Speed Test server chạy tại http://localhost:\${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
});
