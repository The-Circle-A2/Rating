const moment = require('moment');
const ratings = [];

function formatRating(username, mark, stream, info) {
  return {
    username,
    mark,
    stream,
    time: moment().format('DD-MM-YYYY HH:mm'),
    timeWithMilliSeconds: moment().format('DD-MM-YYYY HH:mm ss:SS'),
    info
  };
}

function addRating(id, username, mark, stream) {
  const rating = { id, username, mark, stream };

  ratings.push(rating);

  return rating;
}

function getAverageRating()
{
  let sum = 0;

  for( var i = 0; i < ratings.length; i++ ){
    sum += parseInt( ratings[i], 10 ); //don't forget to add the base
  }

  return sum/ratings.length;
}

module.exports = formatRating;
