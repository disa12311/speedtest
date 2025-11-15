# 🚀 Hướng dẫn Deploy Speed Test

## 📦 Cấu trúc thư mục

```
speed-test/
├── server.js          # File chính
├── package.json       # Dependencies
├── .gitignore        # Ignore files
├── vercel.json       # Config Vercel
└── README.md         # Documentation
```

## 📝 File package.json

```json
{
  "name": "speed-test-pro",
  "version": "2.0.0",
  "description": "Speed test website với độ chính xác cao",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["speed-test", "bandwidth", "network"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 📝 File .gitignore

```
node_modules/
.env
.DS_Store
*.log
.vercel
dist/
```

## 📝 File vercel.json (Deploy Vercel)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 🌐 Cách Deploy

### Phương án 1: Deploy lên Vercel (Khuyên dùng - MIỄN PHÍ)

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Push code lên GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/speed-test.git
git push -u origin main
```

3. **Deploy lên Vercel:**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập bằng GitHub
   - Click "New Project"
   - Import repository của bạn
   - Click "Deploy"
   - Xong! URL của bạn sẽ là: `https://ten-project.vercel.app`

### Phương án 2: Deploy lên Render (MIỄN PHÍ)

1. **Push code lên GitHub (như trên)**

2. **Deploy lên Render:**
   - Truy cập [render.com](https://render.com)
   - Đăng nhập bằng GitHub
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Cài đặt:
     - Name: `speed-test`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Click "Create Web Service"

### Phương án 3: Deploy lên Railway (MIỄN PHÍ)

1. **Push code lên GitHub**

2. **Deploy lên Railway:**
   - Truy cập [railway.app](https://railway.app)
   - Click "Start a New Project"
   - "Deploy from GitHub repo"
   - Chọn repository
   - Tự động deploy!

### Phương án 4: Deploy lên Heroku

1. **Cài Heroku CLI:**
```bash
npm install -g heroku
```

2. **Deploy:**
```bash
heroku login
heroku create speed-test-app
git push heroku main
heroku open
```

---

## 🔧 Cải thiện độ chính xác

### Các tính năng đã thêm:

✅ **Nhiều lần test hơn:**
- Ping: 10 lần (loại bỏ 20% outliers)
- Download: 5 sizes × 2 lần = 10 tests
- Upload: 5 sizes × 2 lần = 10 tests

✅ **Loại bỏ outliers:**
- Tự động loại bỏ 20% giá trị cao/thấp nhất
- Tính trung bình từ giá trị còn lại

✅ **Cache prevention:**
- Headers ngăn cache
- Query string với timestamp

✅ **Jitter measurement:**
- Đo độ biến động ping
- Hiển thị độ ổn định kết nối

✅ **Random data:**
- Upload với random bytes
- Giống tình huống thực tế hơn

✅ **Progressive testing:**
- Test từ nhỏ đến lớn
- Tăng độ chính xác dần

✅ **Statistics:**
- Hiển thị tổng số lần test
- Data transferred
- Thời gian test

---

## 🎯 Test local

```bash
# Cài dependencies
npm install

# Chạy server
npm start

# Mở browser
# http://localhost:3000
```

---

## 🔥 Tips tăng hiệu suất

1. **Sử dụng CDN:** Deploy tại nhiều regions
2. **Compression:** Thêm gzip compression cho production
3. **Rate limiting:** Giới hạn requests để tránh abuse
4. **Analytics:** Thêm tracking để theo dõi usage

---

## 📊 Kết quả mong đợi

- **Ping:** 5-50ms (tùy vị trí server)
- **Download:** Chính xác ±5% so với ISP
- **Upload:** Chính xác ±5-10%
- **Jitter:** <10ms là tốt, >50ms là kém

---

## 🐛 Troubleshooting

**Lỗi CORS:**
- Đã thêm `cors` middleware
- Check browser console

**Test chậm:**
- Server xa → deploy gần hơn
- Network congestion → test lại

**Kết quả không chính xác:**
- Clear browser cache
- Tắt VPN/Proxy
- Test nhiều lần

---

## 📝 License

MIT License - Free to use!
