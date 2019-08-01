const path = require('path');
const htmlpath = path.join(__dirname ,  '../../html/');
const Utils = require('../utils');

function getHTMLPath(filename){
    return path.join(htmlpath, filename);
}

/**
 * Context root of the room router
 * If the room is not started then send them the waiting client
 * if the game is started then redirect them to /game for the
 * game client
 */
module.exports.root = function(req,res){
    let room = req.app.locals.room;
    if(room.started == false){
        res.sendFile(getHTMLPath('waitingroom.html'));
    }
    else{
        res.redirect('/game');
    }
};

/**
 * If there is no room then send them createroom.html
 * If there is a room then send them joinroom.html
 */
module.exports.join = function(req,res){
    let room = req.app.locals.room;

    if(room !== undefined){
        if(room.started){
            res.sendFile(getHTMLPath('cannotjoin.html'));
        }
        else{
            res.sendFile(getHTMLPath('waitingroom.html'));
        }
    }
    else{
        res.sendFile(getHTMLPath('createroom.html'));
    }
}

/**
 * POST /createRoom
 */
module.exports.createRoom = function(req,res) {
    if(req.body && req.body.playerId && req.app.locals.room === undefined){
        const room = {
            started: false,
            players: [req.body.playerId],
            wins: {},
            code: Utils.generateRandomRoomCode(),
            admin: req.body.playerId,
            order: [],
            currentLeader: 0,
        };
        console.log(`Room Created - Code: [${room.code}] Admin: [${room.admin}]`);
        req.app.locals.room = room;
        req.session.playerId = req.body.playerId;
        req.session.roomCode = room.code;
        res.redirect('/');
    }
    else{
        //request is malformed or the room already exists
        res.redirect('/join');
    }
};

/**
 * POST /joinRoom
 */
module.exports.joinRoom = function(req,res) {
    if(req.body && req.body.playerId && req.body.roomCode) {
        const room = req.app.locals.room;
        if(room){
            if(room.code = req.body.roomCode) {
                
                if(room.players.indexOf(req.body.playerId) == -1){
                    room.players.push(req.body.playerId);
                    console.log(`New player [${req.body.playerId}]`);
                }
                else{
                    console.log(`Returning player [${req.body.playerId}]`);
                }

                req.session.playerId = req.body.playerId;
                req.session.roomCode = room.code;
                res.redirect('/');
            }
            else {
                //wrong room code
                res.redirect('/join');
            }
        }
        else{
            //the room doesn't exists yet
            res.redirect('/join');
        }
    }
    else {
        //the request is malformed
        res.redirect('/join');
    }
};

/**
 * GET /getRoom
 * This will return all the info in the room object
 */
module.exports.getRoom = function(req,res){
    res.json(req.app.locals.room);
}