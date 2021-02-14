const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const AddressSchema = require('./Address')

const SeedsHouseSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    address: AddressSchema,
    owner: {
      type: ObjectId,
      ref: 'User',
    },
    collectors: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    groups: [
      {
        type: ObjectId,
        ref: 'Group',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

SeedsHouseSchema.virtual('lots', {
  ref: 'Lot',
  localField: '_id',
  foreignField: 'seeds_house',
})

SeedsHouseSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'seeds_house',
})

SeedsHouseSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'seeds_house',
})

mongoose.model('SeedsHouse', SeedsHouseSchema)
