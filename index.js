const express = require('express');
const session = require('client-sessions');
const app = express();


app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(express.urlencoded({extended: true}));

const routes = require('./routes');
const middleware = require('./middleware');

app.post('/createroom', routes.createRoom);

app.post('/joinroom', routes.joinRoom);

app.get('/join', routes.join);

app.get('/', middleware.requireJoin, routes.context);

app.get('/room/\*', middleware.requireJoin, routes.roomAPI);

app.get('/whoami', middleware.requireJoin, routes.whoami);

app.use('/game/\*', routes.gamerouter);

console.log('Listening on port 3000');
app.listen(3000);
