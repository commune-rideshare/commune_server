var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')
var emoji = require('node-emoji')

var names = require('../config/names')
var settings = require('../config/settings')
var geo = require('./geo')

var driver = {
  create: function create () {
    let newDriver = {
      location: geo.getRandomPoint(),
      name: names.getRandomName(),
      guid: chance.guid(),
      shares: 0,
      trips: 0,
      occupied: false,
      capacity: settings.averageCapacity,
      passengerList: [],
      listenToken: {},
      offerToken: {},
      rejectionToken: {},
      listen () {
        let driver = this
        this.listenToken = PubSub.subscribe('rideRequest', function (msg, data) {
          console.log((emoji.get(':calling:') + '  ' + driver.name + ' received a request from ' + data  + ' @ ' + driver.location.point.geometry.coordinates).bgYellow)
          driver.offerRide()
        })
      },
      offerRide () {
        let driver = this
        // Publish ride offer...
        PubSub.publish('rideOffered', {name: this.name, guid: this.guid})
        // Ride offer accepted
        this.offerToken = PubSub.subscribe(this.guid, function (msg, data) {
          // Stop listening for rejected offers
          PubSub.unsubscribe(driver.rejectionToken)
          driver.acceptRider(data)
        })
        // Ride offer rejected
        this.rejectionToken = PubSub.subscribe('rideRejected', function (msg, data) {
          console.log((emoji.get(':cry:') + '  ' + driver.name + ' rejected').bgRed)
          // Stop listening for offers
          PubSub.unsubscribe(driver.offerToken)
          // Stop listening for rejected offers
          PubSub.unsubscribe(driver.rejectionToken)
        })
      },
      acceptRider (data) {
        this.occupied = true
        PubSub.unsubscribe(this.offerToken)
        PubSub.unsubscribe(this.listenToken)
        console.log((emoji.get(':hammer:') + '  ' + this.name + ' accepts to drive ' + data.name).bgGreen)
      }
    }

    return newDriver
  }
}

module.exports = driver
