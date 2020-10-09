const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Article = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now()
    },
    modifiedTime: {
        type: Date,
        default: Date.now()
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'Article' });
module.exports = mongoose.model('Article', Article);