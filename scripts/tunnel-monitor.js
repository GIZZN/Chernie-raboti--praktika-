import { spawn } from 'child_process';
import fetch from 'node-fetch';

export class TunnelMonitor {
  constructor(config) {
    this.config = {
      checkInterval: 60000,
      retryDelay: 5000,
      maxRetries: 3,
      ...config
    };
    
    this.tunnel = null;
    this.retryCount = 0;
    this.isRunning = false;
  }

  async checkTunnelHealth() {
    try {
      const response = await fetch('http://localhost:3002/health');
      return response.ok;
    } catch (error) {
      console.error('Tunnel health check failed:', error);
      return false;
    }
  }

  async restartTunnel() {
    console.log('Restarting tunnel...');
    
    if (this.tunnel) {
      this.tunnel.kill();
    }

    this.tunnel = spawn('cloudflared', [
      'tunnel',
      '--config',
      this.config.configPath,
      'run'
    ], { stdio: 'inherit' });

    this.tunnel.on('error', (error) => {
      console.error('Tunnel error:', error);
      this.handleTunnelFailure();
    });

    this.tunnel.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Tunnel exited with code ${code}`);
        this.handleTunnelFailure();
      }
    });
  }

  async handleTunnelFailure() {
    if (this.retryCount < this.config.maxRetries) {
      this.retryCount++;
      console.log(`Retry attempt ${this.retryCount}/${this.config.maxRetries}`);
      setTimeout(() => this.restartTunnel(), this.config.retryDelay);
    } else {
      console.error('Max retries reached. Notifying admin...');
      //Здесь добавить отправку уведомлений//
      this.retryCount = 0;
    }
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.restartTunnel();

    setInterval(async () => {
      const isHealthy = await this.checkTunnelHealth();
      if (!isHealthy) {
        console.log('Tunnel is unhealthy, attempting restart...');
        await this.restartTunnel();
      }
    }, this.config.checkInterval);
  }

  stop() {
    if (this.tunnel) {
      this.tunnel.kill();
    }
    this.isRunning = false;
  }
} 