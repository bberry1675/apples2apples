const path = require('path');
const fs = require('fs');

module.exports.generateRandomRoomCode = function() {
  let retValue = '';
  for (let i = 0; i < 4; i++) {
    retValue = retValue + Math.floor(Math.random() * 9);
  }
  return retValue;
};
module.exports.parseCards = function(filename) {
  const cardfile = path.resolve(filename);
  return fs.readFileSync(cardfile, {encoding: 'utf8'}).split('\n').map((line) => {
    return {
      word: line.slice(0, line.indexOf('-')).trim(),
      description: line.slice(line.indexOf('-') + 1, line.indexOf('[') ).trim(),
      from: line.slice(line.indexOf('[') ).trim(),
    };
  });
};
