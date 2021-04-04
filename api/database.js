import mongoose from 'mongoose'

import './models/User'
import './models/Comment'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
} else {
  mongoose.connect('mongodb://localhost/' + process.env.npm_package_name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  mongoose.set('debug', true)
}
