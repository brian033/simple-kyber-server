
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./aggregator-sdk.cjs.production.min.js')
} else {
  module.exports = require('./aggregator-sdk.cjs.development.js')
}
