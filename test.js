var request = require('request');


request.post({
    url: 'http://localhost:3000/joinroom',
    form:{
        roomCode: 2485,
        playerId: 'brando3'
    }
},function(err, response, body){
    console.log(err);
    console.log(response.headers);
    console.log(body);
});