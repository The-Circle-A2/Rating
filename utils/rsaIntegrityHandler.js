global.window = {};
const JSEncrypt = require('jsencrypt')
const CryptoJS = require("crypto-js");
const axios = require('axios');
const {logError} = require('./logmanager');
let lastUpdate;
let userMap = new Map();

function verifyRating(rating, username){
    const verify = new JSEncrypt({default_key_size: 512});

    if (Date.now() - lastUpdate > 900000) {
        userMap.clear();
    }

    //Gebruiker mag maar 1x raten
    return new Promise((resolve, reject) => {
        if (userMap.has(username)){
            verify.setPublicKey(userMap.get(username));

            if(verify.verify(rating.mark + rating.timestamp, rating.signature, CryptoJS.SHA256)) {
                return resolve();
            }
        } else {
            axios.get('http://127.0.0.1:8000/user/' + username)
            .then((response) => {

                /*
                Verify TruYou signature: Bart
                 */
                const verify = new JSEncrypt({default_key_size: 512});
                verify.setPublicKey(process.env.PUBLIC_KEY);
                if(verify.verify(response.body + response.headers['X-timestamp'], response.headers['X-signature'], CryptoJS.SHA256)) {

                    if (response.data.public_key) {// username exists
                        userMap.set(username, response.data.public_key);
                        lastUpdate = Date.now();
                        verify.setPublicKey(response.data.public_key);

                        if (verify.verify(rating.mark + rating.timestamp, rating.signature, CryptoJS.SHA256)) {
                            return resolve();
                        }
                    }
                }

                logError(signRating('[SYSTEM] Invalid signature received from ' + username));

                return reject();
            });
        }
    });
}

function signRating(rating){
    const sign = new JSEncrypt();
    sign.setPrivateKey(process.env.PRIVATE_KEY);
    const timestamp = Date.now();
    const signature = sign.sign(rating + timestamp, CryptoJS.SHA256, "sha256");

    const ratingWithSig = {
        rating: rating,
        signature: signature,
        timestamp: timestamp,
    };

    return ratingWithSig;
}

module.exports = {
    verifyRating,
    signRating
};
