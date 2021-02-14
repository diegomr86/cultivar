const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SeedProcessingSchema = new mongoose.Schema({
  tip: String,
  author: {
    type: ObjectId,
    ref: 'Author',
  },
})

module.exports = SeedProcessingSchema
