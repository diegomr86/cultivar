const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const select = require('../config/utils').select
const Author = mongoose.model('Author')

router.get('/', (req, res) => {
  const query = {}
  Author.find(query, select(req))
    .sort('name')
    .exec(function (err, authors) {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(authors)
      }
    })
})

module.exports = router
