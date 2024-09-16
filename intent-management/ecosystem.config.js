module.exports = {
  apps: [
    {
      name: 'intent-management',
      script: 'npm run start:prod',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_start: '1G',
    },
  ],
};
