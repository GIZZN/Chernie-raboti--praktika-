import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', '=== Сервер запущен успешно ===');
  console.log('\x1b[34m%s\x1b[0m', `→ http://localhost:${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', '=============================');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

//скрипт запуска//
//npm run server//


// # На Windows через Chocolatey:
// choco install cloudflared

// # На Linux:
// curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
// chmod +x cloudflared
// sudo mv cloudflared /usr/local/bin

// # Linux/macOS
// lsof -i :3000
// lsof -i :3002


// # Windows
// netstat -ano | findstr :3000
// netstat -ano | findstr :3002
