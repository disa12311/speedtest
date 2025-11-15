const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Test</title>
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
            max-width: 500px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2em;
        }
        .speed-display {
            text-align: center;
            margin: 30px 0;
        }
        .speed-value {
            font-size: 3em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .speed-label {
            color: #666;
            font-size: 1.2em;
        }
        .results {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .result-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .result-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #764ba2;
            margin: 5px 0;
        }
        .result-label {
            color: #666;
            font-size: 0.9em;
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
        .start-btn:hover {
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
        }
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Speed Test</h1>
        
        <div class="speed-display">
            <div class="speed-label">Download Speed</div>
            <div class="speed-value" id="downloadSpeed">0</div>
            <div class="speed-label">Mbps</div>
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
        </div>

        <div class="results">
            <div class="result-box">
                <div class="result-label">Upload</div>
                <div class="result-value" id="uploadSpeed">0 Mbps</div>
            </div>
            <div class="result-box">
                <div class="result-label">Ping</div>
                <div class="result-value" id="ping">0 ms</div>
            </div>
        </div>

        <div class="status" id="status">Nhấn Start để bắt đầu kiểm tra</div>
        
        <button class="start-btn" id="startBtn" onclick="startTest()">
            Start Test
        </button>
    </div>

    <script>
        let isRunning = false;

        async function startTest() {
            if (isRunning) return;
            
            isRunning = true;
            const btn = document.getElementById('startBtn');
            btn.disabled = true;
            btn.textContent = 'Testing...';
            
            document.getElementById('downloadSpeed').textContent = '0';
            document.getElementById('uploadSpeed').textContent = '0 Mbps';
            document.getElementById('ping').textContent = '0 ms';
            
            try {
                await testPing();
                await testDownload();
                await testUpload();
                
                document.getElementById('status').textContent = 'Kiểm tra hoàn tất!';
            } catch (error) {
                document.getElementById('status').textContent = 'Lỗi: ' + error.message;
            }
            
            btn.disabled = false;
            btn.textContent = 'Start Test';
            isRunning = false;
        }

        async function testPing() {
            document.getElementById('status').textContent = 'Đang kiểm tra ping...';
            const iterations = 5;
            let totalPing = 0;

            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                await fetch('/ping');
                const end = performance.now();
                totalPing += (end - start);
            }

            const avgPing = Math.round(totalPing / iterations);
            document.getElementById('ping').textContent = avgPing + ' ms';
        }

        async function testDownload() {
            document.getElementById('status').textContent = 'Đang kiểm tra tốc độ download...';
            const sizes = [1, 5, 10]; // MB
            let maxSpeed = 0;

            for (let i = 0; i < sizes.length; i++) {
                const size = sizes[i];
                const progress = ((i + 1) / (sizes.length + 2)) * 100;
                document.getElementById('progress').style.width = progress + '%';

                const start = performance.now();
                const response = await fetch('/download?size=' + size);
                await response.arrayBuffer();
                const end = performance.now();

                const duration = (end - start) / 1000;
                const bitsLoaded = size * 1024 * 1024 * 8;
                const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
                
                if (speedMbps > maxSpeed) {
                    maxSpeed = speedMbps;
                    document.getElementById('downloadSpeed').textContent = speedMbps;
                }
            }
        }

        async function testUpload() {
            document.getElementById('status').textContent = 'Đang kiểm tra tốc độ upload...';
            const sizes = [0.5, 1, 2]; // MB
            let maxSpeed = 0;

            for (let i = 0; i < sizes.length; i++) {
                const size = sizes[i];
                const progress = ((sizes.length + i + 1) / (sizes.length * 2 + 2)) * 100;
                document.getElementById('progress').style.width = progress + '%';

                const data = new ArrayBuffer(size * 1024 * 1024);
                
                const start = performance.now();
                await fetch('/upload', {
                    method: 'POST',
                    body: data
                });
                const end = performance.now();

                const duration = (end - start) / 1000;
                const bitsLoaded = size * 1024 * 1024 * 8;
                const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
                
                if (speedMbps > maxSpeed) {
                    maxSpeed = speedMbps;
                    document.getElementById('uploadSpeed').textContent = speedMbps + ' Mbps';
                }
            }

            document.getElementById('progress').style.width = '100%';
        }
    </script>
</body>
</html>
  `);
});

// Ping endpoint
app.get('/ping', (req, res) => {
  res.json({ timestamp: Date.now() });
});

// Download endpoint - generates random data
app.get('/download', (req, res) => {
  const size = parseInt(req.query.size) || 1; // Size in MB
  const bytes = size * 1024 * 1024;
  const data = crypto.randomBytes(bytes);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', bytes);
  res.send(data);
});

// Upload endpoint
app.post('/upload', express.raw({ limit: '50mb', type: 'application/octet-stream' }), (req, res) => {
  res.json({ 
    received: req.body.length,
    timestamp: Date.now() 
  });
});

app.listen(PORT, () => {
  console.log(`Speed Test server đang chạy tại http://localhost:${PORT}`);
});
