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
            //room.order = room.players.sort(() => Math.random() - .5);
            res.json(true);
        }
    }
    else{
        res.status(401).json({error: "Not Admin"});
    }
};
module.exports.submitcard = function(req,res){
    let room = req.app.locals.room;
    let game = req.app.locals.game;
    if(room.order[room.currentLeader] == req.session.playerId){

    }
    else{
        //regular player in the room
        let card = req.body.card;
        if(card){   
            game.submittedcards[req.session.playerId] = card;
            res.json(true);
        }
        else{
            console.log(`Failed to submit card from ${req.session.playerId}`);
            res.json(false);
        }
    }
};
module.exports.votecard = function(req,res){

};
module.exports.getcards = function(req,res){
    let game = req.app.locals.game;
    if(game.playerscards[req.session.playerId]){
        res.json(game.playerscards[req.session.playerId]);
    }
    else{
        res.json([]);
    }
};
module.exports.getsubmittedcards = function(req,res){
    let game = req.app.locals.game;
    let room = req.app.locals.room;
    if(req.session.playerId == room.order[room.currentLeader]){
        res.json(Object.keys(game.submittedcards).map(key => game.submittedcards[key]));
    }
    else{
        //player is in the room so return the card they have
        if(game.submittedcards[req.session.playerId]){
            res.json(submittedcards[req.session.playerId]);
        }
        else{
            res.json({});
        }
        
    }
};