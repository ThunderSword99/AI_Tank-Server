module.exports = {
    apps: [{
        name: "GameAIWebServer",
        script: "./bin/www",
        watch: false,
        env: {
            "NODE_ENV": "production"
        },
        env_development: {
            "NODE_ENV": "development",
        }
    }]
}