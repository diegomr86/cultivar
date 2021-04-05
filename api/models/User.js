const crypto = require('crypto')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')

mongoose.set('useCreateIndex', true)

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: () => {
        return !this.phone
      },
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'inválido'],
    },
    phone: {
      type: String,
      required: () => {
        return !this.email
      },
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: String,
    picture: Object,
    role: String,
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

UserSchema.plugin(uniqueValidator, {
  message: 'Este nome já está sendo usado',
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

UserSchema.methods.data = function () {
  return {
    id: this.id,
    email: this.email,
    phone: this.phone,
    username: this.username,
    name: this.name,
    role: this.role,
    picture: this.picture,
  }
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 3600)

  return jwt.sign(
    {
      exp: parseInt(exp.getTime() / 1000),
      ...this.data(),
    },
    process.env.SECRET || process.env.npm_package_name
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    token: this.generateJWT(),
    ...this.data(),
  }
}

const User = mongoose.models.User || mongoose.model('User', UserSchema)
module.exports = User
