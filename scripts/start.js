import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting server and tunnel...');

const server = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3002' }
});

const startTunnel = () => {
  console.log('Starting tunnel...');
  const tunnel = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:3002'], {
    stdio: 'inherit',
    shell: true
  });

  tunnel.on('error', (err) => {
    console.error('Tunnel error:', err);
    process.exit(1);
  });

  return tunnel;
};

setTimeout(() => {
  const tunnel = startTunnel();

  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.kill();
    tunnel.kill();
    process.exit();
  });
}, 2000);

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});