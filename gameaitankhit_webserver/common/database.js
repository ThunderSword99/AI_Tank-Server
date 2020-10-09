const mongoose = require('mongoose');
const config = require('config');
mongoose.connect(config.get('mongoo'));

function getConnection() {
    const db_connect = mongoose.connection;

    db_connect.on('err', console.log.bind(console, 'connect err'));
    db_connect.once('open', () => {
        console.log('Connected mongodb !!!!');
    });
}
module.exports = {
    getConnection: getConnection,
}