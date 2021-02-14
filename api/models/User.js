const crypto = require('crypto')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const ObjectId = mongoose.Schema.Types.ObjectId
const AddressSchema = require('./Address')
const BankAccountSchema = require('./BankAccount')

const secret = process.env.SECRET || process.env.npm_package_description

mongoose.set('useCreateIndex', true)

const UserSchema = new mongoose.Schema(
  {
    networks: [
      {
        type: ObjectId,
        ref: 'Network',
        required: true,
      },
    ],
    network: {
      type: ObjectId,
      ref: 'Network',
      // required: true
    },
    role: {
      type: String,
      // required: true
    },
    roles: [String],
    group: {
      type: ObjectId,
      ref: 'Group',
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'é obrigatório'],
      match: [/^[a-zA-Z0-9]+$/, 'inválido'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'inválido'],
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      },
      default: null,
    },
    hash: String,
    salt: String,
    name: String,
    nickname: String,
    cpf: String,
    contact: String,
    comments: String,
    image: Object,
    address: AddressSchema,
    bank_account: BankAccountSchema,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

UserSchema.plugin(uniqueValidator, {
  message: 'já está sendo usado',
})

UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      role: this.role,
      network: this.network,
      image: this.image,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    network: this.network,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    role: this.role,
    name: this.name,
    image: this.image,
  }
}

UserSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('collection_areas', {
  ref: 'CollectionArea',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'client',
})

UserSchema.virtual('potentials', {
  ref: 'Potential',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('seeds_matrixes', {
  ref: 'SeedsMatrix',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'collector',
})

UserSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'buyer',
})

UserSchema.virtual('seeds_houses', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'owner',
})

UserSchema.virtual('seeds_houses_collector', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'collectors',
})

mongoose.model('User', UserSchema)
