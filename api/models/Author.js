const mongoose = require('mongoose')

const AuthorSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    description: String,
    quote: String,
    information_type: String,
    published_data: Boolean,
    publication_link: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)
mongoose.model('Author', AuthorSchema)
