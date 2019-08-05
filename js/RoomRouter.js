
const express = require('express');
const session = require('client-sessions');
const router = new express.Router();
const roomRoutes = require('./room/handlers');
const roomMiddleWare = require('./room/middleware');
const gamerouter = require('./GameRouter');

router.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

router.use(express.urlencoded({extended: true}));

/**
 * Create the room object and add it to room.locals
 * Set the connection session
 * redirect back to /
 */
router.post('/createRoom', roomRoutes.createRoom);

/**
 * Set the connection session
 * redirect back to /
 */
router.post('/joinRoom', roomRoutes.joinRoom);

/**
 * require them to join the room
 * if game isn't started then give them waitingroom.html
 * if the game is started then redirect them to /game
 */
router.get('/', roomMiddleWare.requireJoin, roomRoutes.root);

/**
 * if there is no room than give them createroom.html
 * if there is a room then give them joinroom.html
 */
router.get('/join', roomRoutes.join);

/**
 * REQUIRED: client is in the room, and game is started
 * This will pass the request into the game router
 * a GET to the game router context will return the dashboard
 * POST and other GET requests will be handled in GameRouter.js
 */
router.use('/game', roomMiddleWare.requireJoin, gamerouter);

/**
 * This will return the room object so the waiting room client
 * can display information about the room and the game client can
 * also get the information
 * TODO: make sure the request is in the room before they can query it
 */
router.get('/room', roomMiddleWare.accessRoom, roomRoutes.getRoom);

/**
 * Optional endpoint to return specific values of the room
 * TODO: make sure the request is in the room before they can query it
 */
// router.get('/room/*', roomMiddleWare.requireJoin);

/**
 * End point for the admin to start the game
 */
router.post('/startgame', roomMiddleWare.requireJoin, roomMiddleWare.requireAdmin, roomRoutes.startGame);

module.exports = router;
