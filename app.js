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

  socket.on("createARoom", function (objRoom) {
    rooms.unshift(objRoom)
    io.emit('createARoom', objRoom);
  })

  socket.on("joinARoom", function(which) {

    let joinedRoomIndex = rooms.findIndex(room => room.id === which.roomId)
    rooms[joinedRoomIndex].players.push(which.player)
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
})