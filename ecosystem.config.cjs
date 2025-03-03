module.exports = {
  apps: [{
    name: "chernie-raboti",
    script: "./scripts/start.js",
    env: {
      NODE_ENV: "production",
      PORT: 3002
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    },
    node_args: '--experimental-specifier-resolution=node'
  }]
} 