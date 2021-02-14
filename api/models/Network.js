const mongoose = require('mongoose')
const ResponsibleTechnicianSchema = require('./ResponsibleTechnician')
const AddressSchema = require('./Address')

const NetworkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    domain_name: String,
    image: Object,
    description: String,
    cnpj: String,
    renasem: String,
    contact: {
      type: String,
    },
    address: AddressSchema,
    responsible_technician: ResponsibleTechnicianSchema,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

NetworkSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('seeds', {
  ref: 'Seed',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('seeds_houses', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'networks',
})

NetworkSchema.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('collection_areas', {
  ref: 'CollectionArea',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('seeds_matrixes', {
  ref: 'SeedsMatrix',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('potentials', {
  ref: 'Potential',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'network',
})

NetworkSchema.virtual('lots', {
  ref: 'Lot',
  localField: '_id',
  foreignField: 'network',
})

mongoose.model('Network', NetworkSchema)
