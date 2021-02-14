const mongoose = require('mongoose')

const BankAccountSchema = new mongoose.Schema({
  bank_number: String,
  agency: String,
  account: String,
  type: String,
})

module.exports = BankAccountSchema
