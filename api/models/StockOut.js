const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const StockOutSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qtd: {
      type: Number,
      required: true,
    },
    out_mode: String,
    seeds_house: {
      type: ObjectId,
      ref: 'SeedsHouse',
      required: true,
    },
    buyer: {
      type: ObjectId,
      ref: 'User',
    },
    order: {
      type: ObjectId,
      ref: 'Order',
    },
    seed: {
      type: ObjectId,
      ref: 'Seed',
    },
    seed_name: String,
    lot: {
      type: ObjectId,
      ref: 'Lot',
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    comment: String,
  },
  {
    timestamps: true,
  }
)

mongoose.model('StockOut', StockOutSchema)
