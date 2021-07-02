const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const startRatingServer = require('./utils/sockets');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
    allowEIO3: true
});

dotenv.config();
io.set('origins', process.env.CLIENT_URL);

startRatingServer(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
