var state = require('./state')
var settings = require('../config/settings')

var server = require('http').createServer()
var io = require('socket.io')(server)
server.listen(8080)

var communicator = {
  init: function init() {
    console.log('init socket')
    io.on('connect', function (socket) {
      console.log('connected to:', socket.client.id)
      socket.emit('initMap', settings.city)
      socket.emit('setState', state)
      socket.emit('updateStats', state)
      state.riders.forEach(function(rider) {
        socket.emit('addPassenger', rider)
      })
      state.drivers.forEach(function(driver) {
        socket.emit('addDriver', driver)
      })
      socket.on('disconnect', function () {
        console.log('disconnected from:', socket.client.id)
      })
    })
    io.on('disconnect', function (socket) {
      console.log('disconnected from:', socket.client.id)
    })
  },
  broadcast: function broadcast(event, data) {
    io.emit(event, data);
  }
}

module.exports = communicator
