const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SeedItemSchema = new mongoose.Schema({
  qtd: {
    type: mongoose.Mixed,
    required: true,
  },
  compensation_collect: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  wholesale_price: {
    type: Number,
    required: true,
  },
  seed: {
    type: ObjectId,
    ref: 'Seed',
  },
})

module.exports = SeedItemSchema
