module.exports.startgame = function(req,res){
    let room = req.app.locals.room;
    if(req.session.playerId === room.admin){
        if(room.players.length < 4){
            res.status(412).json({error: "Not Enough Players"});
        }
        else if(room.started){
            res.json(true);
        }
        else{
            room.started = true;
            //set the order
            room.order = room.players.sort(() => Math.random() - .5);
        }
    }
    else{
        res.status(401).json({error: "Not Admin"});
    }
};