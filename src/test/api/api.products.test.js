const request = require('supertest')('http://localhost:8080')
const assert = require('chai').assert


describe('Product api test', () => {
  
  describe('GET /productos', () => { 
    it('retorna arr vacio en caso de no haber productos', async () => {
      const response = await request.get('/api/productos')
      assert.equal(response.status, 200, 'se espera respuesta 200')
      assert.deepEqual(response.body, [], 'se espera respuesta arr vacio []')
    })

    it('Retorna todos los productos que hayan', async () => {
      await request.post('/api/productos-test-add/3') // 
      const response = await request.get('/api/productos')
      assert.lengthOf(response.body, 3, 'El array no tiene el largo esperado')
      const expectedKeys = ['title', 'description', 'code', 'price', 'stock', 'thumbnail', 'id']
      assert.deepStrictEqual(Object.keys(response.body[0]), expectedKeys, 'El objeto no tiene todas las claves esperadas')
    })
  })

  describe('GET /productos/:id', () => {
    it('Devuelve el producto del ID seleccionado', async () => {
      const id = (await request.get('/api/productos')).body[0].id    
      const response = await request.get(`/api/productos/${id}`)
      assert.equal(response.body.id, id, 'El producto no tiene el id esperado')
    })

    it('Retorna msg de producto no encontrado por ID incorrecto', async () => {     
      const response = await request.get(`/api/productos/24`)
      assert.equal(response.status, 404, 'Se espera respuesta 404')
      assert.equal(response.body.error, 'producto no encontrado', 'No se recibio mensaje de error esperado')
    })
  })

  describe('DELETE /productos/:id', () => {
    it('Elimina el producto del ID seleccionado', async () => {
      const id = (await request.get('/api/productos')).body[0].id 
      
      const response = await request.delete(`/api/productos/${id}`)
      assert.equal(response.body.message, 'producto borrado', 'El mensaje de respuesta no es el esperado')
      
      const delCheck = await request.get(`/api/productos/${id}`)
      assert.equal(delCheck.body.error, 'producto no encontrado' , 'El producto no sido borrado de la base de datos')
    })

    it('Retorna msg de producto no encontrado si se intenta borrar un producto que no existe', async () => {     
      const response = await request.get(`/api/productos/25`)
      assert.equal(response.status, 404, 'Se espera respuesta 404')
      assert.equal(response.body.error, 'producto no encontrado' , 'La respuesta de error no es la esperada')
    })
  })

  describe('POST /productos/nuevo', () => {
    it('No se agrega producto si los datos del nuevo producto no son correctos', async () => {
      let response = await request.post(`/api/productos/nuevo`)
      assert.equal(response.status, 400, 'Se espera respuesta 400')
      assert.equal(response.body.msg, 'producto no guardado', 'Se ha ingresado producto vacio a la base de datos')

      response = await request.post(`/api/productos/nuevo`).send({
        title: 123456789,
        description: 123456789,
        code: '', 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.jpg'
      })
      assert.equal(response.status, 400, 'Se espera respuesta 400')
      assert.equal(response.body.msg, 'producto no guardado', 'Se ha ingresado producto con datos faltantes a la base de datos')

      response = await request.post(`/api/productos/nuevo`).send({
        title: 123456789,
        description: 123456789,
        code: 123456789, 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.js' 
      })
      assert.equal(response.status, 400, 'Se espera respuesta 400')
      assert.equal(response.body.msg, 'producto no guardado', 'Se ha ingresado producto con una imagen incorrecta a la base de datos')
     })
  
    it('Retorna msg de producto guardado si se ha almacenado exitosamente', async () => {
      const response = await request.post(`/api/productos/nuevo`).send({
        title: 123456789,
        description: 123456789,
        code: 123456789, 
        price: 123456789,
        stock: 123456789,
        thumbnail: '123456789.jpg'
      })
      assert.equal(response.status, 200, 'Se espera respuesta 200')
      assert.equal(response.body.msg, 'producto guardado', 'Mensaje no es el esperado')
    })
  })
  
})