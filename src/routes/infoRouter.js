const express = require('express')

const { Router } = express   
const infoRouter = Router()
const {infoTable} = require('../controllers/infoTable')

const { logger} = require('../log/logger')

infoRouter.get('/', async (req, res) => {
  const table = infoTable()
  logger.info(`Ruta: /info, metodo: ${req.method}`)
  console.log(table)
  res.send(table)
})


module.exports = infoRouter