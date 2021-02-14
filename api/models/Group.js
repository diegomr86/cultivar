const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const AddressSchema = require('./Address')
const BankAccountSchema = require('./BankAccount')

const GroupSchema = mongoose.Schema(
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
    slug: {
      type: String,
    },
    description: String,
    cnpj: String,
    contact: {
      type: String,
    },
    address: AddressSchema,
    bank_account: BankAccountSchema,
    seeds: [
      {
        type: ObjectId,
        ref: 'Seed',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

GroupSchema.virtual('collectors', {
  ref: 'User',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('collection_areas', {
  ref: 'CollectionArea',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('potentials', {
  ref: 'Potential',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('seeds_matrixes', {
  ref: 'SeedsMatrix',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'group',
})

GroupSchema.virtual('seeds_houses', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'groups',
})

mongoose.model('Group', GroupSchema)
