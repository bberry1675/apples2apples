const express = require('express');
const app = express();

const room = require('./js/RoomRouter');

app.use('/', room);

console.log('Listening on port 3000');
app.listen(3000);
