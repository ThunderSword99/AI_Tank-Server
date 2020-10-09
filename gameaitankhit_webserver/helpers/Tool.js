const Bot = require('../models/bot');

async function findBotSelectedByUserID(userID) {
    let bots = await Bot.find({ creator: userID });
    let result= false;
    for (let i=0;i<bots.length;i++){
        if (bots[i].isBotSelected) {
            result= true;
            break;
        }
    }
    return result;
}

async function getBotByUserID(userID) {
    let bots = await Bot.find({ creator: userID });
    let result= null;
    for (let i=0;i<bots.length;i++){
        if (bots[i].isBotSelected) {
            result= bots[i];
            break;
        }
    }
    return result;
}

module.exports = {
    getBotByUserID: getBotByUserID,
    findBotSelectedByUserID: findBotSelectedByUserID
}