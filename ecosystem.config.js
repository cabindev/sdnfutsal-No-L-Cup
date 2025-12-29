module.exports = {
  apps: [{
    name: 'sdnfutsal',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M', // ป้องกัน OOM - restart ถ้าใช้ memory เกิน 500MB
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },

    // Resource limits
    max_restarts: 10,
    min_uptime: '10s',

    // Error handling
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // Security
    kill_timeout: 5000,
    listen_timeout: 3000,

    // Monitoring
    exp_backoff_restart_delay: 100,
  }]
};
