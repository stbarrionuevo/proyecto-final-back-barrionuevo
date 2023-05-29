const { Router } = require('express')  
const productRouter = Router() 
const { newProductController, getAllProductsController, getProductByIdController, getProductsByCategoryController , delProductByIdController } = require('../controllers/productsController')
const { mock5 } = require('../dao/mockFaker')
const { logger, loggererr } = require('../log/logger')



productRouter.get(
  '/productos',
  async (req, res) => {
    const products = await getAllProductsController()
    logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
    res.json( products )
  }
)


productRouter.get(
  '/productos/:id',
  async (req, res) => {
    const product = await getProductByIdController( req.params.id )
    if ( product ) {
      logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
      res.json( product )
    } else {
      loggererr.error(`Product id: ${id} NOT found`) 
      res.status(404).send({ error: 'Product NOT found'})
    }
  }
)

productRouter.get(
  '/productos/categoria/:category',
  async (req, res) => {
    try {
      const products = await getProductsByCategoryController(req.params.category)
      if (products) {
        res.json( products )
      } else {
        logger.warn(`CATEGORY: ${req.params.categoria} NOT FOUND`)
        res.status(404).json({ error: 'Products NOT found' })
      }
    } catch (error) {
      loggererr.error(`Error in route ${req.url}, method ${req.method}: ${error}`)
    }
  }
)



productRouter.post(
  '/productos/nuevo',
  async (req, res) => {
    const productToAdd = req.body
    const loaded = await newProductController ( productToAdd )
    if ( loaded ) {
      logger.info(`Product added succesfully`)
    } else {
      logger.info(`Cannot add product, wrong data`)
    }
    res.redirect('/')
  }
)


productRouter.put(
  '/productos/:id',
  async (req, res) => {
    if(await modifyProductByIdController( req.params.id, req.body )){
      logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
      res.send({ message: 'product has been update'})
    } else {
      loggererr.error(`Product id: ${id} not found`) 
      res.status(404).send({ error: 'product not found'})
    }
  }
)



productRouter.delete(
  '/productos/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id
      const response = await delProductByIdController(id)
      if (response) {
        logger.info(`Product successfully deleted`)
        res.status(200).json({ message: 'DELETED' })
      } else {
        logger.warn(`Product id: ${id} not found`)
        res.status(404).json({ error: 'Product NOT found' })
      }
    } catch (error) {
      loggererr.error(`Error in route ${req.url}, method ${req.method}: ${error}`)
      res.redirect(`/error/Error ${error}`)
    }
  }
) 



module.exports = productRouter