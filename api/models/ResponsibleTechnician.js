const mongoose = require('mongoose')
const AddressSchema = require('./Address')

const ResponsibleTechnicianSchema = new mongoose.Schema({
  name: String,
  cnpj: String,
  crea: String,
  renasem: String,
  contact: String,
  email: String,
  address: AddressSchema,
})

module.exports = ResponsibleTechnicianSchema
