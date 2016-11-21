module.exports = function (app, io) {
  io.on('connection', function (socket) {
    console.log('connected', socket)
  })
}
