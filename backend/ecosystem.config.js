module.exports = {
    apps: [{
        name: 'backend',
        script: './bin/www',
        exec_mode: 'fork',
        instances: 1,
        autorestart: true,
        watch:false,
        max_memory_start: '1G',
    }]
}
