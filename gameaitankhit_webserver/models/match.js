const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Match = new Schema({
    status: {
        type: String,
        require: true,
    },
    result: {
        code: { type: Number },
        replay: { type: String },
        message: { type: String }
    },
    botOne: {
        type: Schema.Types.ObjectId,
        ref: 'Bot'
    },
    botTwo: {
        type: Schema.Types.ObjectId,
        ref: 'Bot'
    },
    challenger: {
        type: Number,
        require: true,
    },
    createdTime: {
        type: Date,
        default: Date.now
    },

}, { collection: 'Match' })

module.exports = mongoose.model('Match', Match);