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
  const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
  return average(ratings);
}

module.exports = {
  formatRating,
  addRating,
  getAverageRating
};
