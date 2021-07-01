const axios = require('axios');

function logError(message) {
    axios.post(process.env.LOGSERVER_URL, message)
      .then((response) => {
        console.log('log done');
      }, (error) => {
        console.log('log error');
      });
}

module.exports = {
    logError
};
