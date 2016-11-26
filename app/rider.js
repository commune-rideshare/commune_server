var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')
var emoji = require('node-emoji')

var names = require('../config/names')
var geo = require('./geo')
var communicator = require('./communicator')
var state = require('./state')

var rider = {
  create: function create () {
    let newRider = {
      location: geo.getRandomPoint(),
      name: names.getRandomName(),
      guid: chance.guid(),
      shares: 0,
      rides: 0,
      percentage: 0,
      inTransit: false,
      waiting: false,
      acceptListener: {},
      offersRecieved: [],
      requestRide () {
        // Publish a ride request
        let rideId = chance.guid()
        PubSub.publish('rideRequest', {name: this.name, rideId: rideId})
        // State: waiting
        this.waiting = true
        console.log((emoji.get(':bell:') + '  ' + this.name + ' requests a ride #' + rideId).bgCyan)
        communicator.broadcast('requestRide', this)
        // SAve this to rider
        let rider = this
        // Listen to offers
        PubSub.subscribe(rideId, function (msg, data) {
          rider.offersRecieved.push(data)
        })
        setTimeout(function(){rider.acceptDriver(rider, rideId)}, 1000)
      },
      acceptDriver (rider, rideId) {
        PubSub.unsubscribe(rideId)
        // console.log((emoji.get(':thumbsup:') + '  Offers for #' + rideId + ' received from ' + rider.offersRecieved.length + ' drivers').bgCyan)
        geo.getClosestDriver(rider.offersRecieved, rider, function(closestDriver) {
          if(closestDriver) {
            // console.log((emoji.get(':earth_africa:') + '  Closest driver is ' + closestDriver.properties.name).bgBlack.bold + ' # ' + rideId)
            // Accept closest
            PubSub.publish(closestDriver.properties.guid + ':' + rideId, {name: rider.name, location: rider.location, rideId: rideId})
          } else {
            console.log((emoji.get(':x:') + '  No driver found').bgRed)
          }
          // Reject others
          PubSub.publish('rideRejected', {name: rider.name})
          // Clear queue
          rider.offersRecieved = []
        })
      }
    }
    return newRider
  }
}

module.exports = rider
