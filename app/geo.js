var Chance = require('chance')
var chance = new Chance()
var MapboxClient = require('mapbox')
var turf = require('turf')
var geohash = require('ngeohash')

var config = require('../config/config')

var geo = {
  mapboxClient: new MapboxClient(config.key),
  getRandomPoint: function getRandomPoint() {

    var location = {
      point: {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [chance.longitude({
            min: 10,
            max: 20,
          }), chance.latitude({
            min: 10,
            max: 20,
          })]
        }
      }
    };

    return location;

  },
  getClosestDriver: function getClosestDriver(riderPoint, driverPointCollection) {
    if (driverPointCollection.features.length != 0) {
      var nearestDriver = turf.nearest(riderPoint, driverPointCollection)
      for (var i = 0, iLen = this.drivers.length; i < iLen; i++) {
        if (this.drivers[i].point.geometry.coordinates === nearestDriver.geometry.coordinates) {
          return i
        } else {
        return -1
        }
      }
    }
  },
  getDirections: function getDirections(start, end, cb) {

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
        });

      });

  }
}

module.exports = geo;
