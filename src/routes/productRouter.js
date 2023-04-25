const { Router } = require('express')  
const productRouter = Router() 

const { newProductController, getAllProductsController, getProductByIdController, delProductByIdController } = require('../controllers/productsController')
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
      loggererr.error(`Producto id: ${id} not found`) 
      res.status(404).send({ error: 'product not found'})
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
  async (req, res) => {
    const id = req.params.id
    if (await delProductByIdController(id)) {
      logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
      res.send({ message: 'product delete'})
    } else {
      loggererr.error(`Product id: ${id} not found`) 
      res.status(404).send({ error: 'product not found'})
    }
  }
) 



productRouter.get(
  '/producos-test',
  async (req, res) => {
    const allProducts = await mock5.getAll()
    let table = '<table>'
    table += '<tr><th>Product</th><th>Price</th><th>Image</th></tr>'
    
    allProducts.forEach((fila) => {
      table += `
        <tr>
          <td>${fila.title}</td>
          <td>${fila.price}</td>
          <td><img src="${fila.thumbnail}" alt="${fila.title}" width="64" heigth="48"></td>
        </tr>`
     })
    tabla += '</table>'

    logger.info(`Ruta: /api${req.url}, metodo: ${req.method}`)
    res.send(table)

  }
)


module.exports = productRouter