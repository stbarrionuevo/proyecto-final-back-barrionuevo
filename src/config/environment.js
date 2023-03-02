const parseArgs = require('minimist')(process.argv.slice(2))
const config = {
  port: parseArgs.p
}


require('dotenv').config()
const staticFiles = process.env.STATICFILES




module.exports = { config, staticFiles }