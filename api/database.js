import mongoose from 'mongoose'

import './models/Network'
import './models/User'
import './models/Author'
import './models/Specie'

import './models/Seed'
import './models/Group'
import './models/SeedsHouse'
import './models/CollectionArea'
import './models/SeedsMatrix'
import './models/Potential'
import './models/Request'
import './models/Order'
import './models/Collection'
import './models/Lot'
import './models/StockIn'
import './models/StockOut'
import './config/passport'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
} else {
  mongoose.connect('mongodb://localhost/' + process.env.npm_package_name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // mongoose.set('debug', true)
}
