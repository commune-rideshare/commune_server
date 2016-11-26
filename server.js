const simulation = require('./app/simulation')
const communicator = require('./app/communicator')

communicator.init()

simulation.start()
