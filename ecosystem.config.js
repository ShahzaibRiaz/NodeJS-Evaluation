module.exports = {
  apps: [
    {
      name: 'Blog-Management-System',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
