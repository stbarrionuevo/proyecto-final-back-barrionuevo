const { Router } = require('express')  
const cartRouter = Router() 
const { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController } = require('../controllers/cartController')
const { logger } = require('../log/logger')
const passport = require('../middlewares/auth')


cartRouter.get('/cart',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const cart = await getCartController( req.session.passport.user )
      logger.info(`Rute: /api${req.url}, method: ${req.method}`)
      res.status(200).send( cart )
    } catch (error) {
      logger.warn(` Error: ${error} while trying to retrieve cart.`)
    }
  }
)


cartRouter.post('/cart',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const added = await addProductToCartController( req.query.itemId,  parseInt(req.query.number), req.session.passport.user )
      logger.info(`Ruta: /api${req.url}, method: ${req.method}`)
      res.status(200).send( added )
    } catch (error) {
      logger.warn(`Error: ${error} while trying to add product to cart.`)
    }
  }
)


cartRouter.delete('/cart/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deleted = await deleteProductFromCartController( req.params.id, req.session.passport.user )
      logger.info(`Ruta: /api${req.url}, method: ${req.method}`)
      res.status(200).send( deleted )
    } catch (error) {
      logger.warn(`Can't delete product from cart. Error: ${error}.`)
    }
  }
)


cartRouter.delete('/cart',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deleted = await deleteCartController( req.session.passport.user )
      logger.info(`Ruta: /api${req.url}, method: ${req.method}`)
      res.status(200).send( deleted )
    } catch (error) {
      logger.warn(`Can't delete cart Error: ${error}.`)
    }
  }
)

module.exports = cartRouter