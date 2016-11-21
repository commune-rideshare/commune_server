var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')
var emoji = require('node-emoji')

var names = require('../config/names')
var settings = require('../config/settings')

var driver = {
  create: function create () {
    let newDriver = {
      name: names.getRandomName(),
      guid: chance.guid(),
      shares: 0,
      trips: 0,
      occupied: false,
      capacity: settings.averageCapacity,
      passengerList: [],
      listenToken: {},
      offerToken: {},
      listen () {
        let driver = this
        // console.log((driver.name + ' subscribes to ride requests').bgYellow)
        this.listenToken = PubSub.subscribe('rideRequest', function (msg, data) {
          console.log((emoji.get(':calling:') + '  ' + driver.name + ' received a request from ' + data).bgYellow)
          driver.offerRide()
        })
      },
      offerRide () {
        let driver = this
        // console.log((this.name + ' offers a ride...').bgYellow)
        // Publish ride offer...
        PubSub.publish('rideOffered', {name: this.name, guid: this.guid})
        this.offerToken = PubSub.subscribe(this.guid, function (msg, data) {
          driver.acceptRider(data)
        })
      },
      acceptRider (data) {
        // console.dir(data)
        // STATE: occupied
        this.occupied = true
        PubSub.unsubscribe(this.offerToken)
        PubSub.unsubscribe(this.listenToken)
        console.log((emoji.get(':hammer:') + '  ' + this.name + ' contracted to drive ' + data.name).bgGreen)
      }
    }

    return newDriver
  }
}

module.exports = driver
