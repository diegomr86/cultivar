const mongoose = require('mongoose')

const ViabilityRateSchema = new mongoose.Schema({
  from: Number,
  to: Number,
  description: String,
})

module.exports = ViabilityRateSchema
