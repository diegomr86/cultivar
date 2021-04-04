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
    },
    comment: {
      type: ObjectId,
      ref: 'Comment',
    },
    user: {
      type: String,
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
  ref: 'Card',
  localField: '_id',
  foreignField: 'comment',
})

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', CommentSchema)
module.exports = Comment
