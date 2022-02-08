module.exports = {
    apps: [
        {
            name: 'cv',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}