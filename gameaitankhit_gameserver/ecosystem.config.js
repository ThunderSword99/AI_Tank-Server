module.exports = {
    apps: [{
        name: "GameAIGameServer",
        script: "app.js",
        watch: false,
        env: {
            "NODE_ENV": "production"
        },
        env_development: {
            "NODE_ENV": "development",
        }
    }]
}