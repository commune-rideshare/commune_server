'use strict'

var Chance = require('chance')
var chance = new Chance()
var PoissonProcess = require('poisson-process')
var colors = require('colors')

var settings = require('../config/settings')
var driver = require('./driver')
var rider = require('./rider')
var state = require('./state')

var simulation = {
  start: function start () {
    console.log('Initializing simulation...'.green)

    // Spawn drivers
    console.log(('Creating ' + settings.numberOfDrivers + ' drivers...').bgYellow)
    for (let i = 0; i < settings.numberOfDrivers; i++) {
      let newDriver = driver.create()
      console.log((newDriver.name).yellow)
      state.drivers.push(newDriver)
      state.drivers[state.drivers.length - 1].listen()
    }

    // Spawn riders
    console.log(('Creating ' + settings.numberOfRiders + ' riders..').bgCyan)
    for (let i = 0; i < settings.numberOfRiders; i++) {
      let newRider = rider.create()
      console.log((newRider.name).cyan)
      state.riders.push(newRider)
    }

    // Define the event loop
    console.log('Starting Event-loop...'.green)
    var eventLoop = PoissonProcess.create(settings.simulationSpeed, function message () {
      let riderIndex = 0
      while (true) {
        riderIndex = chance.integer({min: 0, max: settings.numberOfRiders - 1})
        if (state.riders[riderIndex].inTransit === true) {
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


  //       // Find closest driver
  //       driverIndex = city.getClosestDriver(city.riders[riderIndex])
  //
  //       // / If there are no cars available, add the request to the waiting list
  //       if (driverIndex < 0) {
  //         log.noDrivers()
  //         city.waitingList.push(riderIndex)
  //         draw.waitingRider(city.riders[riderIndex].id)
  //         return
  //       }
  //
  //       // Push ride-acceptance notification
  //       log.accept(city.drivers[driverIndex])
  //
  //       // Set drivers state to occupied
  //       city.drivers[driverIndex].occupied = true
  //
  //       // Activate closest driver
  //       draw.activateDriver(city.drivers[driverIndex].id)
  //
  //       // Get directions between driver and rider
  //       city.directions(city.drivers[driverIndex], city.riders[riderIndex], function (route) {
  //         // Move driver to rider
  //         draw.route({
  //           'route': route.route,
  //           'routeId': route.routeId,
  //           'color': config.pickUpRouteColor,
  //           'animate': true,
  //           'driver': city.drivers[driverIndex]
  //         }, function () {
  //           // Push pick-up notification
  //           log.pickUp(city.riders[riderIndex], city.drivers[driverIndex], route.route)
  //
  //           // Remove the rider-point from the map
  //           // draw.remove(city.riders[riderIndex].id);
  //
  //           // Indicate driver...
  //           // draw.workingDriver(city.drivers[driverIndex].id);
  //
  //           // Add Rider to passangerlist
  //           city.drivers[driverIndex].passengerList.push(city.riders[riderIndex].id)
  //
  //           // Draw route to destination
  //           city.directions(city.riders[riderIndex], destination, function (route) {
  //             // Draw guide path
  //             draw.route({
  //               'route': route.route,
  //               'routeId': guideRouteId,
  //               'color': config.emptyRouteColor,
  //               'animate': false
  //             }, function () {
  //               // console.log('draw trip commence', city.riders[riderIndex]);
  //
  //               // Move rider + driver to destination
  //               draw.route({
  //                 'route': route.route,
  //                 'routeId': route.routeId,
  //                 'color': config.emptyRouteColor,
  //                 'animate': true,
  //                 'driver': city.drivers[driverIndex],
  //                 'rider': city.riders[riderIndex]
  //               }, function () {
  //                 //
  //                 //
  //                 // RIDE COMPLETED
  //                 //
  //                 //
  //
  //                 ping.play()
  //
  //                 // Remove the guide-route from the map
  //                 draw.remove(guideRouteId)
  //
  //                 // Calculate shares to issue based on on distance
  //                 newShares = Math.floor(route.route.distance)
  //
  //                 // Update stats
  //                 city.totalShares += 2 * newShares
  //                 city.totalTrips++
  //
  //                 // Update global stats view
  //                 $('#total-shares').text(city.totalShares)
  //                 $('#total-trips').text(city.totalTrips)
  //
  //                 // Push drop-off notification
  //                 log.dropOff(city.riders[riderIndex], city.drivers[driverIndex], route.route)
  //
  //                 //
  //                 // Update ride-table
  //                 //
  //
  //                 var newRide = {
  //                   id: rideIndex,
  //                   distance: route.route.distance,
  //                   shares: (newShares * 2)
  //                 }
  //                 city.rides.push(newRide)
  //                 $('.ride-table-body').prepend('<tr id="' + newRide.id + '" class="' + newRide.id + '"><td>' + newRide.id + '</td><td class="distance">' + newRide.distance + '</td><td class="shares">' + newRide.shares + '</td>><tr>')
  //
  //                 //
  //                 // Update RIDER object and view
  //                 //
  //
  //                 // Add shares to riders account
  //                 city.riders[riderIndex].shares += newShares
  //                 // Add trip to riders account
  //                 city.riders[riderIndex].trips++
  //                 // Set state of rider to "not in transit"
  //                 city.riders[riderIndex].inTransit = false
  //                 // Set location of rider to drop-off-point
  //                 city.riders[riderIndex].point.geometry.coordinates = route.route.geometry.coordinates[route.route.geometry.coordinates.length - 1]
  //                 // Hide rider
  //                 // draw.deActivateRider(city.riders[riderIndex].id);
  //                 // Update view with rider shares
  //                 $('#' + city.riders[riderIndex].id)
  //                   .children('.shares')
  //                   .text(city.riders[riderIndex].shares)
  //                 // Update view with rider trips
  //                 $('#' + city.riders[riderIndex].id)
  //                   .children('.trips')
  //                   .text(city.riders[riderIndex].trips)
  //
  //                 //
  //                 // Update DRIVER object and view
  //                 //
  //
  //                 // Add trip to drivers account
  //                 city.drivers[driverIndex].trips++
  //                 // Add shares to drivers account
  //                 city.drivers[driverIndex].shares += newShares
  //                 // Set state of driver to "not occupied"
  //                 city.drivers[driverIndex].occupied = false
  //                 // Set location of driver to drop-off-point
  //                 city.drivers[driverIndex].point.geometry.coordinates = route.route.geometry.coordinates[route.route.geometry.coordinates.length - 1]
  //                 // DE-activate driver
  //                 draw.deActivateDriver(city.drivers[driverIndex].id)
  //                 // Update view with driver shares
  //                 $('#' + city.drivers[driverIndex].id)
  //                   .children('.shares')
  //                   .text(city.drivers[driverIndex].shares)
  //                 // Update view with driver ownership percentage
  //                 // Update view with driver trips
  //                 $('#' + city.drivers[driverIndex].id)
  //                   .children('.trips')
  //                   .text(city.drivers[driverIndex].trips)
  //
  //                 // Update ownership percentage
  //                 calculateOwnershipPercentage()
  //               })
  //             })
  //           })
  //         })
  //       })
  //     })
