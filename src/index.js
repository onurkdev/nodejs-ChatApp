const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

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

    const filter = new Filter()
    
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')
    socket.on('sendMessage', (message, callback)=>{
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.emit('message', message)
        callback('Delivered')
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left!')
    })
    
    socket.on('sendLocation', (coords,callback)=>{
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
}
)
// directory


// Connection
const PORT =process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})