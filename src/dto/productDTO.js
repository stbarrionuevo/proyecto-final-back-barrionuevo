const getDAO = require('../dao/factory')


const getAllProductsDto = async() => {
  const products = await (await getDAO()).products
  const allProducts = await products.getAll()
  return allProducts
}

const getProductByIdDto = async( id ) => {
  const products = await (await getDAO()).products
  const productById = await products.getById( id )
  return productById
}

const delProductByIdDto = async( id ) => {
  const products = await (await getDAO()).products
  await products.deleteById( id )
  return 
}

const getProductsByCategoryDto = async( category ) => {
  const products = await (await getDAO()).products
  const productByCategory = await products.getByCategory( category )
  return productByCategory
}

const delAllProductsDto = async() => {
  const products = await (await getDAO()).products
  await products.deleteAll()
  return 
}

const addNewProductDto = async( item ) => {
  console.log( item )
  const products = await (await getDAO()).products
  await products.add( item )
  return 
}

const modifyProductByIdDto = async( id, item ) => {
  const products = await (await getDAO()).products
  const response = await products.modifyById( id, item )
  return response
}



module.exports = { getAllProductsDto, getProductByIdDto, getProductsByCategoryDto,delProductByIdDto, delAllProductsDto, addNewProductDto, modifyProductByIdDto }