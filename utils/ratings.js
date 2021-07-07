const moment = require('moment');
const ratings = [];

function formatRating(id, username, mark, stream, info) {
  return {
    id,
    username,
    mark,
    stream,
    time: moment().format('DD-MM-YYYY HH:mm'),
    timeWithMilliSeconds: moment().format('DD-MM-YYYY HH:mm ss:SS'),
    info
  };
}

function addRating(rating) {
  ratings.push(rating.rating);

  return rating;
}

function editRating(rating) {
  ratings.find(rating => rating.username === rating.username).mark = rating.mark;
}

function getSocketFromCurrentUser(username) {
  return ratings.find(rating => rating.username === username);
}

function getAverageRating()
{
  let total = 0;

  for(let i = 0; i < ratings.length; i++) {
    total += parseFloat(ratings[i].mark);
  }

  return parseFloat(total / ratings.length).toFixed(1);
}

module.exports = {
  formatRating,
  addRating,
  editRating,
  getAverageRating,
  getSocketFromCurrentUser
};
