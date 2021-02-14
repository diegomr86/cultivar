const mongoose = require('mongoose')

const GeolocationSchema = new mongoose.Schema({
  lat: String,
  lng: String,
})

module.exports = GeolocationSchema
