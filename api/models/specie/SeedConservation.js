const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SeedConservationSchema = new mongoose.Schema({
  nature_of_seeds: String,
  author: {
    type: ObjectId,
    ref: 'Author',
  },
})

module.exports = SeedConservationSchema
