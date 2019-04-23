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

  socket.on("createARoom", function (newRoom) {
    rooms.push(newRoom)
    io.emit("getAllRooms", rooms)
  })

  socket.on("joinARoom", function(which) {
    let joinedRoomIndex = rooms.findIndex(room => room.id === which.roomId)
    console.log(joinedRoomIndex);
    rooms[joinedRoomIndex].players.push(which.player)
    io.emit("getAllRooms", rooms)
  })

  socket.on("updateScore", function(currentRoom) {
    rooms = currentRoom
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