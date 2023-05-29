const express = require('express')

const { Router } = express   
const infoRouter = Router()

const { config , MONGOSESSION} = require('../config/environment')



const PORT = ( config.port ) ? config.port : 8080
infoRouter.get('/', async (req, res) => {
  res.render('info', {
    port: PORT,
    url: MONGOSESSION.split('@')[1].split('?')[0],

    })
})

infoRouter.get('/:error', (req, res) => {
  res.render('error', { error: req.params.error })
})


module.exports = infoRouter