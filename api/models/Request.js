const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const RequestSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
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
    qtd: {
      type: mongoose.Mixed,
      required: true,
    },
    compensation_collect: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    wholesale_price: {
      type: Number,
      required: true,
    },
    seed: {
      type: ObjectId,
      ref: 'Seed',
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

mongoose.model('Request', RequestSchema)
