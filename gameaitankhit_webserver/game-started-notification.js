const pendingList = new Map();

exports.getResponseInstance = function(matchID) {
  //  if (pendingList.has(matchID))
        return pendingList[matchID];
  //  return null;
}

exports.setResponseInstance = function(matchID, res) {
    return pendingList[matchID] = res;
}