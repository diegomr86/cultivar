const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const GeolocationSchema = require('./Geolocation')

const CollectionSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    date_time: {
      type: String,
      required: true,
    },
    seed: {
      type: ObjectId,
      ref: 'Seed',
    },
    collector: {
      type: ObjectId,
      ref: 'User',
    },
    group: {
      type: ObjectId,
      ref: 'Group',
    },
    weight_gross: Number,
    weight_benef: Number,
    flowering: Date,
    geolocation: GeolocationSchema,
    images: [Object],
    audio: String,
    commentary: String,
  },
  {
    timestamps: true,
  }
)

mongoose.model('Collection', CollectionSchema)
