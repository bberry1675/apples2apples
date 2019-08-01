module.exports.requireJoin = function(req, res, next) {
  const room = req.app.locals.room;
  // if no room exists clear session and send to create room
  if (room && req.session && room.players.indexOf(req.session.playerId) != -1 && room.code == req.session.roomCode) {
    next();
  } else {
    res.redirect('/join');
  }
};
module.exports.objmiddleware = function(req, res, next) {
  if (req.app.locals.game) {
    next();
  } else {
    const fs = require('fs');

    req.app.locals.game = {
      // redcards: true,
      // greencards: false,
      playercards: {},
      submittedcards: {},
      // judgecard: {judgecard object}
    };

    const parseCardLine = function(element) {
      return {
        term: element.slice(0, element.indexOf('-')).trim(),
        desc: element.slice(element.indexOf('-') + 1, element.indexOf('[')).trim(),
        from: element.slice(element.indexOf('[') + 1, element.indexOf(']')).trim(),
      };
    };

    // load in the cards from the files
    // load in the red cards
    if (!req.app.locals.game.redcards) {
      const readtemp = fs.readFileSync('./data/redcards.txt').toString('utf8');
      req.app.locals.game.redcards = readtemp.split('\n').map(parseCardLine);
    }

    // load in the green cards from the files
    if (!req.app.locals.game.greencards) {
      const readtemp = fs.readFileSync('./data/greencards.txt').toString('utf8');
      req.app.locals.greencards = readtemp.split('\n').map(parseCardLine);
    }


    // load in the green cards
    next();
  }
};
