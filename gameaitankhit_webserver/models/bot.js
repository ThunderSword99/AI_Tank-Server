const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Bot = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    win: {
        type: Number,
        default: 0
    },
    lose: {
        type: Number,
        default: 0
    },
    draw: {
        type: Number,
        default: 0
    },
    isBotSelected: {
        type: Boolean,
        default: false
    },
    isBotDeleted: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'Bot' });
module.exports = mongoose.model('Bot', Bot);