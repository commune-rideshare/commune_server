'use strict'

var cities = [
  {
    text: 'Hong Kong',
    value: 'hongkong',
    center: [114.1771, 22.2926],
    zoom: 14
  }, {
    text: 'Frankfurt',
    value: 'frankfurt',
    center: [8.6750147, 50.1096728],
    zoom: 14
  }, {
    text: 'Maputo',
    value: 'maputo',
    center: [32.5676463, -25.9556824],
    zoom: 15.5
  }, {
    text: 'Amsterdam',
    value: 'amsterdam',
    center: [4.8574038, 52.3561256],
    zoom: 15,
    bounds: {
      _ne: {
        lat: 52.379663,
        lng: 4.889484
      },
      _sw: {
        lat: 52.339387,
        lng: 4.8345323
      }
    }
  }
]

module.exports = cities
