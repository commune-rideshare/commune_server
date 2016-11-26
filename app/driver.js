var Chance = require('chance')
var chance = new Chance()
var PubSub = require('pubsub-js')
var emoji = require('node-emoji')

var names = require('../config/names')
var settings = require('../config/settings')
var geo = require('./geo')
var communicator = require('./communicator')
var state = require('./state')


var driver = {
  create: function create (i) {
    let newDriver = {
      index: i,
      location: geo.getRandomPoint(),
      name: names.getRandomName(),
      guid: chance.guid(),
      shares: 0,
      rides: 0,
      percentage: 0,
      occupied: false,
      capacity: settings.averageCapacity,
      passengerList: [],
      listenToken: {},
      offerToken: {},
      rejectionToken: {},
      listen () {
        let driver = this
        geo.snapToRoads(this.location, function(snapLocation){
          driver.location = snapLocation
          this.listenToken = PubSub.subscribe('rideRequest', function (msg, data) {
            // console.log((emoji.get(':calling:') + '  ' + driver.name + ' received a request from ' + data.name).bgYellow)
            driver.offerRide(data)
          })
        })
      },
      offerRide (data) {
        let driver = this
        PubSub.publish(data.rideId, {name: this.name, guid: this.guid, index: this.index, point: this.location})
        this.offerToken = PubSub.subscribe(this.guid + ':' + data.rideId, function (msg, data) {
          PubSub.unsubscribe(driver.rejectionToken)
          driver.acceptRider(data)
        })
        this.rejectionToken = PubSub.subscribe('rideRejected', function (msg, data) {
          // console.log((emoji.get(':cry:') + '  ' + driver.name + ' rejected').bgRed)
          PubSub.unsubscribe(driver.offerToken)
          PubSub.unsubscribe(driver.rejectionToken)
        })
      },
      acceptRider (data) {
        this.occupied = true
        PubSub.unsubscribe(this.offerToken)
        PubSub.unsubscribe(this.listenToken)
        // console.dir(data)
        console.log((emoji.get(':hammer:') + '  ' + this.name + ' accepts to drive ' + data.name ).bgGreen)
        communicator.broadcast('acceptRide', this)
        this.pickUp(data)
      },
      pickUp(data) {
        console.log('pickup')
        geo.getDirections(this.location, data.location, function(routeData){
          state.rides.push({guid: data.rideId, distance: routeData.route.distance})
          communicator.broadcast('updateRides', state.rides)
          // console.dir(routeData)
          communicator.broadcast('pickUp', routeData)
        })
      }
    }
    return newDriver
  }
}

module.exports = driver
