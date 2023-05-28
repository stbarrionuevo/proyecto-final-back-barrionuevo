const passport = require('passport')
const { Strategy } = require('passport-local')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const decodedToken = require('./googleauth')
const { logger } = require('../log/logger')

const { checkUserController, getUserController, newUserController } = require('../controllers/usersController')


passport.use(
  'login',
  new LocalStrategy(
    async function( username, password, done ) {
      const validateUser = await checkUserController (username, password)
      if ( validateUser.result ) {     
        return done( null, { username: username } )
      } else {
        logger.info(`Error entering username or password.`)
        return done( null, false )
      }
    }
  )
)


passport.use(
  'googleauth',
  new Strategy(
    async function ( username, password, done ) {
      const googleUser = await decodedToken( password )
      const userInDb = await checkUserController ( username, '' )
      if ( userInDb.msg != 'No existe usuario' & googleUser.email === username ) { // usuario ya cargado en base de datos       
        return done ( null, { username: username })
      } 
      if ( userInDb.msg === 'No existe usuario' & googleUser.email === username ) {
        await newUserController (username, password)
        return done ( null, { username: username })
      }
      logger.info(`Usuario no valido`)
      return done( null, false)
    }
  )
)


passport.use(
  'register',
  new LocalStrategy(
    async function( username, password, done ) {
      if ( await newUserController (username, password ) ) {
        return done( null, { username: username } )
      } else {
        logger.info(`Failed to register User.`)
        return done( null, false )
      }
    }
  )
)

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtsecretkey, 
    },
    async (payload, done) => {
      try {
        const user = await getUserController( payload.username )
        return done(null, user !== null ? user : false)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)



passport.serializeUser( function(user, done) {
  done(null, user.username)
})

passport.deserializeUser( function(username, done) {
  done(null, { username: username })
})


module.exports = {passport}

module.exports.generateJwtToken = ( username ) =>{
  const payload = {
    username: username
  }
  const options = {
    expiresIn: jwtexpires 
  }
  return jwt.sign(payload, jwtsecretkey, options)
}