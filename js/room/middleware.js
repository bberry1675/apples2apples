/**
 * if the user has a session and the session has a player id and a room code
 */
module.exports.requireJoin = function(req, res, next) {
  const room = req.app.locals.room;

  if (
  // there is a room
    room &&
        // the connection has a session
        req.session &&
        // the session is a player
        req.session.playerId &&
        // the session is for a room
        req.session.roomCode &&
        // the player is in the room
        room.players.indexOf(req.session.playerId) != -1 &&
        // the player has access to the room
        room.code == req.session.roomCode
  ) {
    next();
  } else {
    res.redirect('/join');
  }
};

/**
 * used to authorized the request for the api points of the room
 */
module.exports.accessRoom = function(req, res, next) {
  const room = req.app.locals.room;
  if (room) {
    // TODO: make sure the request is coming from someone in the room
    // some how
    next();
  } else {
    res.status(404).json({success: false, error: 'Room does not exist'});
  }
};

/**
 * Used to check that the request is from the admin of the room
 */
module.exports.requireAdmin = function(req, res, next) {
  const room = req.app.locals.room;
  if (req.session.playerId == room.admin) {
    next();
  } else {
    res.redirect('/');
  }
};
