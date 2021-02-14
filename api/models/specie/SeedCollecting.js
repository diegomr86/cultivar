const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SeedCollectingSchema = new mongoose.Schema({
  tip: String,
  author: {
    type: ObjectId,
    ref: 'Author',
  },
})

module.exports = SeedCollectingSchema
