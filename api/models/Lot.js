const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const LotSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    seeds_house: {
      type: ObjectId,
      ref: 'SeedsHouse',
      required: true,
    },
    seed: {
      type: ObjectId,
      ref: 'Seed',
    },
    seed_name: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

LotSchema.plugin(uniqueValidator, {
  message: 'Esse código do lote já está sendo usado',
})

LotSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'lot',
})

LotSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'lot',
})

mongoose.model('Lot', LotSchema)
