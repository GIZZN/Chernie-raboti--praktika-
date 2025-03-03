import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function startTunnel() {
  const tunnel = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:3002'], {
    stdio: 'inherit'
  });

  tunnel.on('spawn', () => {
    console.log('Tunnel process started');
  });

  tunnel.on('error', (err) => {
    console.error('Failed to start tunnel:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    tunnel.kill();
    process.exit();
  });

  return tunnel;
} 