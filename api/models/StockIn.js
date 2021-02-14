const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const StockInSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    seeds_house: {
      type: ObjectId,
      ref: 'SeedsHouse',
      required: true,
    },
    group: {
      type: ObjectId,
      ref: 'Group',
    },
    collector: {
      type: ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    qtd: {
      type: Number,
      required: true,
    },
    collection_date: Date,
    number_of_matrixes: Number,
    compensation_collect: {
      type: Number,
    },
    seed: {
      type: ObjectId,
      ref: 'Seed',
      required: true,
    },
    lot: {
      type: ObjectId,
      ref: 'Lot',
      required: true,
    },
    seed_name: String,
    group_collector_name: String,
    comment: String,
  },
  {
    timestamps: true,
  }
)

mongoose.model('StockIn', StockInSchema)
