const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CommentSchema = mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
      index: true,
    },
    comment: {
      type: ObjectId,
      ref: 'Comment',
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

CommentSchema.virtual('answers', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'comment',
})

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', CommentSchema)
module.exports = Comment
