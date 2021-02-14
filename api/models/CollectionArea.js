const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const GeolocationSchema = require('./Geolocation')
const AddressSchema = require('./Address')

const CollectionAreaSchema = mongoose.Schema(
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
    description: String,
    estimated_area: Number,
    geolocation: GeolocationSchema,
    address: AddressSchema,
    vegetations: [String],
    collector: {
      type: ObjectId,
      ref: 'User',
    },
    group: {
      type: ObjectId,
      ref: 'Group',
    },
    documents: [Object],
  },
  {
    timestamps: true,
  }
)

mongoose.model('CollectionArea', CollectionAreaSchema)
