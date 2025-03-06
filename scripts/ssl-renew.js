import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SSL_DIR = path.join(__dirname, '../ssl');

export async function renewSSL() {
  if (!fs.existsSync(SSL_DIR)) {
    console.error('SSL directory not found');
    return;
  }

  console.log('Starting SSL certificate renewal...');

  const certbot = spawn('certbot', [
    'renew',
    '--webroot',
    '--webroot-path=/var/www/html',
    '--email=your@email.com',
    '--agree-tos',
    '--no-eff-email'
  ]);

  certbot.stdout.on('data', (data) => {
    console.log(`Certbot output: ${data}`);
  });

  certbot.stderr.on('data', (data) => {
    console.error(`Certbot error: ${data}`);
  });

  certbot.on('close', (code) => {
    if (code === 0) {
      console.log('SSL certificates renewed successfully');
      // Перезапускаем сервер для применения новых сертификатов
      spawn('pm2', ['restart', 'chernie-raboti']);
    } else {
      console.error(`Certbot failed with code ${code}`);
    }
  });
}

// Запускаем обновление каждые 60 дней
setInterval(renewSSL, 60 * 24 * 60 * 60 * 1000); 