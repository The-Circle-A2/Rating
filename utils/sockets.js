const {
    formatRating,
    addRating,
    editRating,
    getAverageRating,
    getSocketFromCurrentUser
} = require('./ratings');
const {logError} = require('./logmanager');
const {verifyRating, signRating} = require('./rsaIntegrityHandler');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

function startRatingServer(io) {

    io.on('connection', socket => {

        socket.on('rate', (rating) => {
            verifyRating(rating, rating.username)
                .then(() => {
                    emitRating(formatRating(socket.id, rating.username, rating.mark, rating.stream, false));
                    //SaveMongoDB(rating, user, rating.signature, true);
                    logError(signRating(`[RATING] ${rating.username} send: ${rating.mark}`));
                });
        });

        socket.on('getAverageRating', () => {
            const rating = getSocketFromCurrentUser(rating.username);

            //Get average
            let average_rating = getAverageRating();
            console.log("Average Rating: " + average_rating);

            //Emit
            io.to(user.stream).emit('averageRatings', signRating(average_rating));
            logError(signRating(`[AVERAGE_RATING] ${rating.username} has requested average rating ${average_rating}`));
        });
    });

    function emitRating(rating){
        //Add or edit if exists
        if(!getSocketFromCurrentUser(rating.username)) {
            addRating(signRating(rating));
        } else {
            editRating(rating);
        }

        //Get average
        let average_rating = getAverageRating();
        console.log("Average Rating: " + average_rating);

        //Emit
        io.emit('rating', signRating(average_rating));
        logError(signRating(`[AVERAGE_RATING] ${rating.username} has requested average rating ${average_rating}`));
    }

    function SaveMongoDB(rating, user, signature, verified){
        MongoClient.connect(process.env.MONGODB_URL, (err, client) => {
            if (err) throw err;

                const db = client.db("seechange_rating");
                let document = {_id: new ObjectID(), rating: rating.mark, username: user.username, verified: verified, time: rating.timestamp, stream: user.stream, signature: signature };

                db.collection('ratings').insertOne(document).then((saveObject) => {
            }).catch((err) => {
                // console.log(err);
                console.log('chat save error');
            }).finally(() => {
                console.log('chat save done');
                //client.close();
            });
        });
    }
}

module.exports = startRatingServer;
