const parseArgs = require('minimist')(process.argv.slice(2)) 
const config = {
  port: parseArgs.p, 
  mode: parseArgs.m, 
  same: parseArgs.a 
}


require('dotenv').config()
const staticFiles = process.env.STATICFILES
const persistence = process.env.PERSISTENCE
const MONGOSESSION = process.env.MONGOSESSION



module.exports = { config, staticFiles, persistence,MONGOSESSION }