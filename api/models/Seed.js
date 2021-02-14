const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const SeedSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    specie: {
      type: ObjectId,
      ref: 'Specie',
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    scientific_name: {
      type: String,
      required: true,
    },
    local_name: String,
    description: String,
    price: {
      type: Number,
      required: true,
    },
    wholesale_price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    seeds_kg: {
      type: Number,
    },
    viability_rate: {
      type: Number,
    },
    lot_limit: Number,
    compensation_collect: Number,
    ecosystem: [String],
    fruiting_season: [String],
    images: [Object],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

SeedSchema.virtual('potentials', {
  ref: 'Potential',
  localField: '_id',
  foreignField: 'seed',
})

SeedSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'seed_items.seed',
})

SeedSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'seed',
})

SeedSchema.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'seeds',
})

SeedSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'seed',
})

SeedSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'seed',
})

SeedSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'seed',
})

mongoose.model('Seed', SeedSchema)
