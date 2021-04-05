const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Comment = mongoose.model('Comment')

router.get('/', (req, res) => {
  const query = { archived: false }
  if (req.query.target) {
    query.target = req.query.target
  }
  Comment.find(query)
    .populate('answers')
    .exec((err, comments) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(comments)
      }
    })
})

router.get('/:id', (req, res) => {
  const query = { _id: req.params.id }
  Comment.findOne(query).exec((err, comment) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(comment)
    }
  })
})

router.post('/', authenticated, (req, res) => {
  const newComment = new Comment(req.body)
  newComment.user = req.user.id
  newComment.save((err, comment) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(comment)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  const query = { _id: req.params.id, user: req.user.id }
  Comment.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    (err, comment) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(comment)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }

  Comment.findOne(query).exec(async (err, comment) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      comment.archived = true
      await comment.save()
      res.send(comment)
    }
  })
})

module.exports = router
