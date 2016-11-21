var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')
var emoji = require('node-emoji')

var names = require('../config/names')
var geo = require('./geo')

var rider = {
  create: function create () {
    let newRider = {
      location: geo.getRandomPoint(),
      name: names.getRandomName(),
      guid: chance.guid(),
      shares: 0,
      trips: 0,
      inTransit: false,
      waiting: false,
      acceptListener: {},
      requestRide () {
        // Publish a ride request
        PubSub.publish('rideRequest', this.name)
        // State: waiting
        this.waiting = true
        console.log((emoji.get(':bell:') + '  ' +  this.name + ' requests a ride @ ' + this.location.point.geometry.coordinates).bgCyan)
        // SAve this to rider
        let rider = this
        // Listen to offers
        PubSub.subscribe('rideOffered', function (msg, data) {
          console.log((emoji.get(':thumbsup:') + '  ' +  rider.name + ' received an offer from ' + data.name).bgCyan)
          PubSub.publish(data.guid, {name: rider.name})
          PubSub.publish('rideRejected', {name: rider.name})
          PubSub.unsubscribe('rideOffered')
        })
      }
    }
    return newRider
  }
}

module.exports = rider
