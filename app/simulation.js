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

var simulation = {
  start: function start () {
    console.log((emoji.get(':car:') + '  ' + 'commune').bgBlack)
    console.log((emoji.get(':vertical_traffic_light:') + '  ' + 'Initializing simulation...').green)

    // Spawn drivers
    console.log((emoji.get(':blue_car:') + '  ' + 'Creating ' + settings.numberOfDrivers + ' drivers...').bgYellow)
    for (let i = 0; i < settings.numberOfDrivers; i++) {
      let newDriver = driver.create()
      console.log((newDriver.name).yellow)
      state.drivers.push(newDriver)
      state.drivers[state.drivers.length - 1].listen()
    }

    // Spawn riders
    console.log((emoji.get(':imp:') + '  ' + 'Creating ' + settings.numberOfRiders + ' riders..').bgCyan)
    for (let i = 0; i < settings.numberOfRiders; i++) {
      let newRider = rider.create()
      console.log((newRider.name).cyan)
      state.riders.push(newRider)
    }

    // Define the event loop
    console.log((emoji.get(':recycle:') + '  ' + 'Starting Event-loop...').green)
    var eventLoop = PoissonProcess.create(settings.simulationSpeed, function message () {
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

    // Start the event loop
    eventLoop.start()
  }
}

module.exports = simulation
