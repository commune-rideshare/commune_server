var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')

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
      listen () {
        let driver = this
        console.log((driver.name + ' subscribes to ride requests').bgYellow)
        PubSub.subscribe('rideRequest', function (msg, data) {
          console.log((driver.name + ' Received a request from ' + data).bgYellow)
          driver.offerRide()
        })
      },
      offerRide () {
        let driver = this
        console.log((this.name + ' offers a ride...').bgYellow)
        // Publish ride offer...
        PubSub.publish('rideOffered', {name: this.name, guid: this.guid})
        // STATE: occupied
        this.occupied = true
        // PubSub.unsubscribe('rideRequest')
        PubSub.subscribe(this.guid, function (msg, data) {
          driver.acceptRider(data)
        })
      },
      acceptRider (data) {
        // console.dir(data)
        PubSub.unsubscribe(this.guid)
        PubSub.unsubscribe('rideRequest')
        console.log((this.name + ' contracted to drive ' + data.name).bgYellow)
      }
    }

    return newDriver
  }
}

module.exports = driver
