const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Active = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'Active' });
module.exports = mongoose.model('Active', Active);