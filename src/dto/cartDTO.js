const getDAO = require('../dao/factory')

const getCartDto = async( username ) => {
  const carts = await (await getDAO()).carts
  const cart = await carts.getByUsername( username )
  return cart
}

const addProductToCartDto = async( itemId, number, username ) => {
  const carts = await (await getDAO()).carts
  const response = await carts.addProductToCart( itemId, number, username )
  return response
}

const deleteProductFromCartDto = async( itemId, username ) => {
  const carts = await (await getDAO()).carts
  const response = await carts.delProductFromCart( itemId, username )
  return response
}

const deleteCartDto = async( username ) => {
  const carts = await (await getDAO()).carts
  const response = await carts.delCart( username )
  return response
}





module.exports = { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto }