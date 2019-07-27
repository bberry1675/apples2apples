const fs = require('fs');

const file = fs.readFileSync('redcards.txt', {flag: 'r'});

const cards = file.toString('utf8').split('\n').map((element) => {
  return {
    term: element.slice(0, element.indexOf('-')).trim(),
    desc: element.slice(element.indexOf('-') + 1, element.indexOf('[')).trim(),
    from: element.slice(element.indexOf('[') + 1, element.indexOf(']')).trim(),
  };
});

const get7Cards = function(game) {
  const retValues = [];
  for (let i = 0; i < 7; i++) {
    const cardNum = Math.floor(Math.random() * (game.redcards.length + 1));
    retValues.push(game.redcards[cardNum]);
    game.redcards.splice(cardNum, 1);
  }
  return retValues;
};

const hand = get7Cards({redcards: cards});
console.log(hand[0]);
console.log(cards.filter((element) => {
  if (element.term === hand[0].term) {
    return true;
  } else {
    return false;
  }
}));


