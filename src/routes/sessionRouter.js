const express = require('express')
const { Router } = require('express')
const sessionRouter = Router() 
const passport = require('../middlewares/auth')
const { generateJwtToken } = require('../middlewares/auth')
const { logger, loggererr } = require('../log/logger')
const { addUserController, getUserController } = require('../controllers/usersController')



sessionRouter.get('/',
  async (req, res) => {
    if (req.session.passport) {
      let userData = await getUserController( req.session.passport.user )
      if (userData) {
        logger.info(`User ${req.session.passport.user} logged in`)
        userData = Object.assign({}, userData._doc, { token: generateJwtToken(req.session.passport.user) })
        res.status(200).send(userData)
      } else {
        logger.warn(`User not found ${req.session.passport.user}`) 
        res.status(401).send(null)
      }
    } else {
      logger.info(`
      No user logged in`) 
      res.status(401).send(null)
    }
  }
)


//POST login
sessionRouter.post(
  '/login', 
  passport.authenticate('login'),
  async (req, res) => {
    let userData = await getUserController( req.body.username )
    if (userData) {
      logger.info(`User ${req.body.username} logged in`)
      userData = Object.assign({}, userData._doc, { token: generateJwtToken(req.session.passport.user) })
      res.status(200).send(userData)
    } else {
      logger.warn(`Could not retrieve data for ${req.body.username} from the database`)
      
    }
  }
)

//LOGIN googleauth

sessionRouter.post(
  '/logingoogle', 
  passport.authenticate('googleauth'),
  function(req, res) {
    logger.info(`
    Authentication with Google successful`)
    res.status(200).send({ message: 'successful authentication.' })
  }
)


//POST Register 
sessionRouter.post(
  '/register',
  passport.authenticate('register'),
  ( req, res) => {
    if ( addUserController ({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      age: req.body.age,
      photo: req.body.photo
    })) {
      logger.info(`User created successfully`)
      res.status(200).send({ result: true, msg: 'User created successfully'})
    } else {
      logger.info(`
      Failed to create user`)
      res.status(200).send({ result: false, msg: 'Failed to create user'})
    }
  }
)

//LOGOUT
sessionRouter.post(
  '/logout',
  async (req, res) => {
    addBlackListJWT( req.headers.authorization)
    req.session.destroy((err) => {
      if (err) {
        loggererr.error(`
        Could not log out, error: ${err}`)
      } else {
        logger.info(`
        Closed session.`)
        res.redirect('/')
      }
    })
  }
)


module.exports = sessionRouter

