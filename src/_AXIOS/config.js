const parseArgs = require('minimist')(process.argv.slice(2)) 
const config = {
  add: parseArgs.a, 
  list: parseArgs.l, 
  del: parseArgs.d, 
  mod: parseArgs.m 
}

module.exports = config