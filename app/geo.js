var Chance = require('chance')
var chance = new Chance()
var MapboxClient = require('mapbox')
var turf = require('turf')

var config = require('../config/config')
var settings = require('../config/settings')
var dummyLocation = {
      point: {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          "coordinates": [chance.longitude({
            min: settings.city.bounds._sw.lng,
            max: settings.city.bounds._ne.lng,
          }), chance.latitude({
            min: settings.city.bounds._sw.lat,
            max: settings.city.bounds._ne.lat,
          })]
        }
      }
    }

var geo = {
  mapboxClient: new MapboxClient(config.key),
  getRandomPoint: function getRandomPoint () {
    var rawLocation = {
      point: {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          "coordinates": [chance.longitude({
            min: settings.city.bounds._sw.lng,
            max: settings.city.bounds._ne.lng,
          }), chance.latitude({
            min: settings.city.bounds._sw.lat,
            max: settings.city.bounds._ne.lat,
          })]
        }
      }
    }
    return rawLocation
  },
  getClosestDriver: function getClosestDriver (offers, rider, cb) {
    // console.dir(rider);
    let riderPoint = turf.point(rider.location.point.geometry.coordinates)
    let features = []
    offers.forEach(function(offer){
      offer.point.point.geometry.coordinates
      let feature = turf.point(offer.point.point.geometry.coordinates, {
          "guid": offer.guid,
          "index": offer.index,
          "name": offer.name
      })
      features.push(feature)
    })
    var nearestDriver = turf.nearest(riderPoint, {
      type: "FeatureCollection",
      features: features
    })
    if(nearestDriver) {
      // console.dir(nearestDriver)
      cb(nearestDriver)
    } else {
      cb(null)
    }
  },
  getDirections: function getDirections (start, end, cb) {
    this.mapboxClient.getDirections([{
      latitude: start.point.geometry.coordinates[1],
      longitude: start.point.geometry.coordinates[0]
    }, {
      latitude: end.point.geometry.coordinates[1],
      longitude: end.point.geometry.coordinates[0]
    }],
      function (err, res) {
        cb({
          route: res.routes[0],
          routeId: chance.guid(),
          driver: start
        })
      })
  },
  snapToRoads: function snapToRoads(rawLocation, cb) {

    this.getDirections(rawLocation, dummyLocation, function(routeData){

      var snapLocation = {
        point: {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            "coordinates": routeData.route.geometry.coordinates[0]
          }
        }
      }

      cb(snapLocation)

    })

  }
}

module.exports = geo
