const assert = require('chai').assert
const { addProducts } = require('./auxfunction')
const { getAllProductsController, newProductController, getProductByIdController, delProductByIdController } = require('../controllers/productsController')


describe('Product controller', () => {
  
  describe('getAllProductsController', () => { 
    it('retorna arr vacio si no hay productos', async () => {
      const result = await getAllProductsController()
      assert.deepEqual(result, [], 'No pasa el test de arr vacio')
    })

    it('retorna todos los productos que hay', async () => {
      await addProducts(3)
      const result = await getAllProductsController()
      assert.lengthOf(result, 3, 'El array no tiene el largo esperado')
      const expectedKeys = ['title', 'description', 'code', 'price', 'stock', 'thumbnail', 'id']
      assert.deepStrictEqual(Object.keys(result[0]), expectedKeys, 'El objeto no tiene todas las claves esperadas')
    })
  })

  describe('getProductByIdController', () => {
    it('Devuelve el producto del id seleccionado', async () => {
      const id = (await getAllProductsController())[0].id    
      const result = await getProductByIdController ( id )
      assert.equal(result.id, id, 'El producto no tiene el id esperado')
    })

    it('Retorna valor NULL si el pedido es de un ID que no existe o no está disponible', async () => {     
      const result = await getProductByIdController ('ID no valida')
      assert.equal(result, null, 'El producto no es nulo')
    })
  })

  describe('delProductbyIdController', () => {
    it('Elimina el producto del ID seleccionado', async () => {
      const id = (await getAllProductsController())[0].id
      const result = await delProductByIdController ( id )
      assert.equal(result, true, 'El producto no ha sido borrado')
      const delCheck = await getProductByIdController (id)
      assert.equal(delCheck, null, 'El producto no sido borrado de la base de datos')
    })

    it('Retorna valor FALSE si se intenta eliminar un producto cuyo ID que no existe', async () => {     
      const result = await delProductByIdController ('ID no valida')
      assert.equal(result, false, 'Retorna valor FALSE si se intenta eliminar un producto cuyo ID que no existe')
    })
  })

  describe('newProductController', () => {
    it('Devuelve FALSE si los datos del productos nuevo no son correctos o están incompletos, NO es almacenado', async () => {
      let result = await newProductController({})
      assert.equal(result, false, 'Se ha ingresado producto vacio a la base de datos')

      result = await newProductController({
        title: 123456789,
        description: 123456789,
        code: '', 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.jpg'
      })
      assert.equal(result, false, 'Se ha ingresado producto con datos faltantes a la base de datos')

      result = await newProductController({
        title: 123456789,
        description: 123456789,
        code: 123456789, 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.js' 
      })
      assert.equal(result, false, 'Se ha ingresado producto con imagen incorrecta a la base de datos')
    })
  
    it('Devuelve TRUE si se agrega exitosamente un producto nuevo, es almacenado', async () => {
      const result = await newProductController({
        title: 123456789,
        description: 123456789,
        code: 123456789, 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.jpg'
      })
      assert.equal(result, true, 'No se ha ingresado producto a la base de datos')
    })
  })
  
})
