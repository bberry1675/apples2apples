module.exports.startgame = function(req, res) {
  const room = req.app.locals.room;
  if (req.session.playerId === room.admin) {
    if (room.players.length < 4) {
      res.status(412).json({error: 'Not Enough Players'});
    } else if (room.started) {
      res.json(true);
    } else {
      const game = req.app.locals.game;
      room.started = true;
      room.order = room.players.sort(() => Math.random() - .5);

      const get7Cards = function(game) {
        const retValues = [];
        for (let i = 0; i < 7; i++) {
          const cardNum = Math.floor(Math.random() * (game.redcards.length + 1));
          retValues.push(game.redcards[cardNum]);
          game.redcards.splice(cardNum, 1);
        }
        return retValues;
      };

      // give each of the players 7 red cards from the deck and do not repeat
      room.players.forEach(function(player) {
        const hand = get7Cards(game);
        game.playercards[req.session.playerId] = hand;
      });

      // assign judgecard property of game object
      const pullJudgeCard = function(game) {
        // greencards
        const retIndex = Math.floor(Math.random() * (game.greencards.length + 1));
        const retValue = game.greencards[retIndex];
        game.greencards.splice(retIndex, 1);
        return retValue;
      };

      // set the judge card for that round
      game.judgecard = pullJudgeCard(game);

      // return true so the client cant reload the window to go to dashboard
      res.json(true);
    }
  } else {
    res.status(401).json({error: 'Not Admin'});
  }
};
module.exports.submitcard = function(req, res) {
  const room = req.app.locals.room;
  const game = req.app.locals.game;
  if (room.order[room.currentLeader] == req.session.playerId) {
    res.json({error: 'cannot submit a card as the round judge'});
  } else {
    // regular player in the room
    // TODO: make sure the card is part of the players hand before submitting it
    const card = req.body.card;
    if (card) {
      game.submittedcards[req.session.playerId] = card;
      res.json(true);
    } else {
      console.log(`Failed to submit card from ${req.session.playerId}`);
      res.json(false);
    }
  }
};
module.exports.votecard = function(req, res) {
  const room = req.app.locals.room;
  const game = req.app.locals.game;
  if (room.order[room.currentLeader] == req.session.playerId) {
    // check that the card they are voting for is in the submitted cards list
    // get the key(nickname) of the submitted card
    // give the owner of the card a win in the room

    // iterate over all the cards in the submitted cards list
    // remove the card from submitted cards
    // remove the card from the corresponding players hand
    // give them another card

    // remove the judge card
    // pull another judge card

    // increment the current leader to the next person in the order
  } else {
    res.json({error: 'Cannot vote for a card when not round judge'});
  }
};
module.exports.getcards = function(req, res) {
  const game = req.app.locals.game;
  if (game.playercards[req.session.playerId]) {
    res.json(game.playerscards[req.session.playerId]);
  } else {
    res.json([]);
  }
};
module.exports.getsubmittedcards = function(req, res) {
  const game = req.app.locals.game;
  const room = req.app.locals.room;
  if (req.session.playerId == room.order[room.currentLeader]) {
    res.json(Object.keys(game.submittedcards).map((key) => game.submittedcards[key]));
  } else {
    // player is in the room so return the card they have
    if (game.submittedcards[req.session.playerId]) {
      res.json(submittedcards[req.session.playerId]);
    } else {
      res.json({});
    }
  }
};
module.exports.getJudgeCard = function(req, res) {
  const game = req.app.locals.game;
  if (game && game.judgecard) {
    res.json(game.judgecard);
  } else {
    res.json({});
  }
};
