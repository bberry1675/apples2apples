module.exports.generateRandomRoomCode = function(){
    let retValue = '';
    for(let i = 0 ; i < 4; i++){
        retValue = retValue + Math.floor(Math.random() * 9);
    }
    return retValue;
}