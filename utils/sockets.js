const formatRating = require('./ratings');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getStreamUsers
} = require('./users');
const {logError} = require('./logmanager');
const {verifyRating, signRating} = require('./rsaIntegrityHandler');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

function startRatingServer(io) {

    io.on('connection', socket => {

        socket.on('rate', rating => {
            verifyRating(rating, rating.username)
                .then(() => {
                    const user = getCurrentUser(socket.id);
                    emitRating(user, formatRating(user.username, rating.mark, user.stream, false));
                    SaveMongoDB(rating, user, rating.signature, true);

                    logError(signRating(`[RATING] ${user.username} send: ${rating.rating}`));
                });
        });
    });

    function emitRating(user, rating){
        io.to(user.stream).emit('rating', signRating(rating));
    }

    function SaveMongoDB(rating, user, signature, verified){
        console.log(rating);

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
