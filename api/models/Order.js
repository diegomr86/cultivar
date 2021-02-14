const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const SeedItemSchema = require('./SeedItem')

const OrderSchema = mongoose.Schema(
  {
    network: {
      type: ObjectId,
      ref: 'Network',
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    client: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    date_receiving: Date,
    deadline: Date,
    purchase_type: {
      type: String,
      default: 'Varejo',
    },
    contract: String,
    vegetation: String,
    restored_area: Number,
    bog: Boolean,
    flood: Boolean,
    amount_paid: Number,
    amount_remain: Number,
    comments: String,
    seed_items: [SeedItemSchema],
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

mongoose.model('Order', OrderSchema)
