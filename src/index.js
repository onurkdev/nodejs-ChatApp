const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// const { default: mongoose } = require('mongoose');
// require('dotenv').config()

// Mongo DB Connections
// mongoose.connect(process.env.MONGO_DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(response=>{
//     console.log('MongoDB Connection Succeeded.')
// }).catch(error=>{
//     console.log('Error in DB connection: ' + error)
// });
const publicDirectoryPath = path.join(__dirname, '../public');

// Middleware Connections
app.use(express.static(publicDirectoryPath))
app.use(cors())
app.use(express.json())

let count = 0

io.on('connection', (socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')
    socket.on('sendMessage', (message)=>{
        io.emit('message', message)
    })
    // socket.emit('countUpdated', count)
    // socket.on('increment', ()=>{
    //     count++
    //     io.emit('countUpdated', count)
    // })
}
)
// directory


// Connection
const PORT =process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})