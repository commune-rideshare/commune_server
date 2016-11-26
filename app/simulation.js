'use strict'

var Chance = require('chance')
var chance = new Chance()
var PoissonProcess = require('poisson-process')
var colors = require('colors')
var emoji = require('node-emoji')

var settings = require('../config/settings')
var driver = require('./driver')
var rider = require('./rider')
var state = require('./state')
var communicator = require('./communicator')

var simulation = {
  start: function start () {
    console.log((emoji.get(':car:') + '  ' + 'commune').bgBlack)
    console.log((emoji.get(':vertical_traffic_light:') + '  ' + 'Initializing simulation...').green)

    this.counter(10)

    // Spawn drivers & riders
    this.spawnDrivers()
    this.spawnRiders()

    // Define the event loop
    let loop = this.eventLoop()

    // Start the event loop
    loop.start()
  },
  spawnDrivers () {
    console.log((emoji.get(':blue_car:') + '  ' + 'Creating ' + settings.numberOfDrivers + ' drivers...').bgYellow)
    for (let i = 0; i < settings.numberOfDrivers; i++) {
      let newDriver = driver.create(i)
      console.log((newDriver.name).yellow)
      state.drivers.push(newDriver)
      state.drivers[state.drivers.length - 1].listen()
      communicator.broadcast('addAgent', state.drivers[state.drivers.length - 1].location)
    }
  },
  spawnRiders () {
    console.log((emoji.get(':imp:') + '  ' + 'Creating ' + settings.numberOfRiders + ' riders..').bgCyan)
    for (let i = 0; i < settings.numberOfRiders; i++) {
      let newRider = rider.create()
      console.log((newRider.name).cyan)
      state.riders.push(newRider)
      communicator.broadcast('addAgent', state.riders[state.riders.length - 1].location)
    }
  },
  counter(inc) {
    setInterval(function() {
      state.time += inc
    }, 1000)
  },
  eventLoop () {
    console.log((emoji.get(':recycle:') + '  ' + 'Starting Event-loop...').green)
    return PoissonProcess.create(settings.simulationSpeed, function message () {
      console.log((emoji.get(':collision:') + '  event triggered @ ' + Date.now()).bgBlack)
      let riderIndex = 0
      while (true) {
        riderIndex = chance.integer({min: 0, max: settings.numberOfRiders - 1})
        if (state.riders[riderIndex].inTransit || state.riders[riderIndex].waiting) {
          continue
        } else {
          state.riders[riderIndex].requestRide()
          break
        }
      }
    })
  }
}

module.exports = simulation
