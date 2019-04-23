const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000
server.listen(port)

let rooms = []

io.on('connection', function(socket) {
    socket.on("getAllRooms", function() {
        io.emit("getAllRooms", rooms)
    })

    socket.on("createARoom", function(objRoom) {
        rooms.unshift(objRoom)
        io.emit('createARoom', objRoom);
    })

    socket.on("joinARoom", function(which) {

        let joinedRoomIndex = rooms.findIndex(room => room.id === which.roomId)
        rooms[joinedRoomIndex].players.push(which.player)
        console.log(rooms[joinedRoomIndex])
        io.emit("joinARoom", rooms[joinedRoomIndex])
        io.emit("getAllRooms", rooms)
    })

    socket.on("exitFromARoom", function(which) {
        let joinedRoomIndex = rooms.findIndex(room => room.id === which.roomId)
        let playerIndex = rooms[joinedRoomIndex].players.findIndex(player => player.id === which.playerId)

        rooms[joinedRoomIndex].players.splice(playerIndex, 1)
        console.log(rooms[joinedRoomIndex]);
        io.emit("getAllRooms", rooms)
    })

    socket.on('fruitClicked', function() {
        let fruitAxis = {}
        fruitAxis.yimage = Math.floor(Math.random() * (480 - 60))
        fruitAxis.ximage = Math.floor(Math.random() * ((999) - 60))
        io.emit('fruitClicked', fruitAxis)
    })

    socket.on('fruitNotClicked', function() {
        io.emit('fruitNotClicked')
    })

    socket.on('onChange', function() {
        // let rand = Math.floor(Math.random() * 7)
        io.emit('onChange', Math.floor(Math.random() * 7))
    })
})