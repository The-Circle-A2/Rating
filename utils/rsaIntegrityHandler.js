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

    return new Promise((resolve, reject) => {
        userMap.set("j.jansen", "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyYCtUTlrCDjKJ2HrDpe2CzotqZw5imLe6BdDmgniGuuLVYxG3Y40lcCSDfuUZXcaf53YgYZ08/j3tbU1yslkoW0KdGx0Sf4MC6VCKFVyGHSp6JRiwhjHI+PBzxlQTqBDQC+WPHpRDLAxKS1lBrO2AQ/CO9uSGABZy5IGgsIEoTd1W9BYpAdn7o3olke45qVXr56UsHN+o9e3mSo2b5g2qjVjfUmItYMru+zPgfk9rqcmzNbff5wUwKvfjc8Rr9jOxoy1bi9PGlScwejABWff3dfFt16piFwECQWN2bdaKXsdC06dbua5JTV+/Ohko338Fzeu3Xg5qGMt84KecRrwmwIDAQAB-----END PUBLIC KEY-----");
        userMap.set("w.corner", "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbm8q/fT7YUn4lmf9sFExMXWy21qInp/kpoaPWTNEd9vg66icYktLfxhUXTdr0UnbeQwpjX3yEQ8nUQy+MLLnOhoFxPUfre3jXGB7rSuOadEL8RCoJRY3UiFikwZCTVuxZf2N51m0vQuogOhMxryr9CBwSi25f0+8cImibteZ5ccgx2pDMknSz9XTxRwSM+1f/ILuk3+s/0q8AE6y3TyNZGkj509vvlqgYDClUEZdtyULrdVBG2bIgQoYwe00B0Vk0URU+J/Ein48a0pRxqT1dfQpcWjoJNkKr/gaW7isrpM6NJWfnsYUBwnPXu7xz1iHFAA5S1/WUe9TBojS0gK6wIDAQAB-----END PUBLIC KEY-----");

        if (userMap.has(username)){
            verify.setPublicKey(userMap.get(username));

            if(verify.verify(rating.mark + rating.timestamp, rating.signature, CryptoJS.SHA256)) {
                return resolve();
            }
        } else {
            console.log("axios");
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
