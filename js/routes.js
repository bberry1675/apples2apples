const utils = require('./utils');
const path = require('path');
const htmlpath = './';
module.exports.join = function(req, res) {
  if (req.app.locals.room === undefined) {
    res.sendFile(path.join(__dirname, htmlpath, '../html/createroom.html'));
  } else {
    if (req.app.locals.room.started) {
      res.json('gamestarted');
    } else {
      res.sendFile(path.join(__dirname, htmlpath, '../html/joinroom.html'));
    }
  }
};
module.exports.createRoom = function(req, res) {
  if (req.body && req.body.playerId && req.app.locals.room === undefined) {
    const room = {
      started: false,
      players: [req.body.playerId],
      wins: {},
      code: utils.generateRandomRoomCode(),
      admin: req.body.playerId,
      order: [],
      currentLeader: 0,

    };

    console.log(`Room Code: [${room.code}] Admin: [${room.admin}]`);
    req.app.locals.room = room;
    req.session.playerId = req.body.playerId;
    req.session.roomCode = room.code;

    res.redirect('/');
  } else {
    res.redirect('/join');
  }
};

module.exports.joinRoom = function(req, res) {
  if (req.body && req.body.playerId && req.body.roomCode) {
    const room = req.app.locals.room;
    if (room === undefined) {
      res.redirect('/join');
    } else {
      if (room.code == req.body.roomCode && room.players.indexOf(req.body.playerId) == -1) {
        room.players.push(req.body.playerId);
        req.session.playerId = req.body.playerId;
        req.session.roomCode = req.body.roomCode;
        console.log(`Player: [${req.body.playerId}] Joined: [${room.players}]`);
        res.redirect('/');
      } else {
        req.session.playerId = req.body.playerId;
        req.session.roomCode = req.body.roomCode;
        res.redirect('/');
      }
    }
  } else {
    res.redirect('/join');
  }
};
module.exports.context = function(req, res) {
  const room = req.app.locals.room;
  if (room.started) {
    res.sendFile(path.join(__dirname, htmlpath, '../html/dashboard.html'));
  } else {
    res.sendFile(path.join(__dirname, htmlpath, '../html/waitingroom.html'));
  }
};
module.exports.roomAPI = function(req, res) {
  const room = req.app.locals.room;
  const prop = req.path.slice(req.path.lastIndexOf('/') + 1);
  console.log(`Looking for Prop: [${prop}] in [${Object.keys(room)}]`);
  if (Object.keys(room).indexOf(prop) != -1) {
    res.json(room[prop]);
  } else {
    res.json(undefined);
  }
};

module.exports.whoami = function(req, res) {
  res.json(req.session.playerId);
};

module.exports.getRoom = function(req,res) {
  res.json(req.app.locals.room);
}

const gameRouter = require('express').Router();
const gameRoutes = require('./gameroutes');
const middleware = require('./middleware');

gameRouter.use(middleware.requireJoin);

gameRouter.use(middleware.objmiddleware);
gameRouter.get('/startgame', gameRoutes.startgame);

module.exports.gamerouter = gameRouter;

