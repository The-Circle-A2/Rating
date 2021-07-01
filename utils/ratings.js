const moment = require('moment');

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

module.exports = formatRating;
