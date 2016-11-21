/*
 *
 *  Set up Express, start server, start socket.io...
 *
 */

var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var server = app.listen(port)
var io = require('socket.io').listen(server)

var simulation = require('./app/simulation')

/*
 *
 *  Sockets
 *
 */

require('./app/socket.js')(app, io)

/*
 *
 *  Simulation
 *
 */

simulation.start()

/*
 *
 *  Start app
 *
 */

exports = module.exports = app
