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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.use('/assets', express.static(path.join(__dirname, '../src/assets'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.use('/api', createProxyMiddleware({ 
  target: `http://localhost:${PORT}`,
  changeOrigin: true,
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', '=== Сервер запущен успешно ===');
  console.log('\x1b[34m%s\x1b[0m', `→ http://localhost:${PORT}`);
  console.log('\x1b[36m%s\x1b[0m', '=============================');
});

// Обработка ошибок
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