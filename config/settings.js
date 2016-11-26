'use strict'

var cities = require('./cities')

var settings = {
  simulationSpeed: 10000,
  city: cities[3], // Amsterdam
  numberOfRiders: 30,
  numberOfDrivers: 12,
  averageCapacity: 3
}

module.exports = settings
