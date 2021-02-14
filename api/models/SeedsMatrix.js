const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const GeolocationSchema = require('./Geolocation')

const SeedsMatrixSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    scientific_name: String,
    description: String,
    collec_months: [Number],
    geolocation: GeolocationSchema,
    group: {
      type: ObjectId,
      ref: 'Group',
    },
    collector: {
      type: ObjectId,
      ref: 'User',
    },
    collection_area: {
      type: ObjectId,
      ref: 'CollectionArea',
    },
    documents: [Object],
  },
  {
    timestamps: true,
  }
)

mongoose.model('SeedsMatrix', SeedsMatrixSchema)
