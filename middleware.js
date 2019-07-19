module.exports.requireJoin = function(req,res,next){
    let room = req.app.locals.room;
    //if no room exists clear session and send to create room
    if(room && req.session && room.players.indexOf(req.session.playerId) != -1 && room.code == req.session.roomCode){
        next();
    }
    else{
        res.redirect('/join');
    }
}