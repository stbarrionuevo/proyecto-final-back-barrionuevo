const { Router } = require('express')  
const chatRouter = Router() 
const { getAllChatsController, addChatMsgController } = require('../controllers/chatsController')
const { logger} = require('../log/logger')
const passport = require('../middlewares/auth')



chatRouter.get(
  '/chat/:username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const chats = await getAllChatsController( req.params.username )
      logger.info(`Ruta: /api${req.url}, method: ${req.method}`)
      res.status(200).send( chats )
    } catch (error) {
      logger.warn(`
      Cannot retrieve chat. ERROR: ${error}.`)
    }
  }
)


chatRouter.post(
  '/chat/:msg',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const added = await addChatMsgController( req.params.msg, req.session.passport.user )
      logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
      res.status(200).send( added )
    } catch (error) {
      logger.warn(`
      Can't add message. ERROR: ${error}.`)
      res.redirect(`info/error/Error when trying to add the message: ${error}`)
    }
  }
)


module.exports = chatRouter