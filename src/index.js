const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, genberateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users') 


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
    
    

    socket.on('join', (options, callback) => {
        addUser({id: socket.id, ...options})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

    })
    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id)

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback('Delivered')
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage('Admin'`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
    
    socket.on('sendLocation', (coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', genberateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
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