const { getCartDto, addProductToCartDto, deleteProductFromCartDto, deleteCartDto } = require('../dto/cartDTO')



const getCartController = async( username ) => {
  const cart = await getCartDto( username )
  return cart
}

const addProductToCartController = async( itemId, number, username ) => {
  const response = await addProductToCartDto( itemId, number, username )
  return response
}

const deleteProductFromCartController = async( itemId, username ) => {
  const response = await deleteProductFromCartDto( itemId, username )
  return response
}

const deleteCartController = async( username ) => {
  const response = await deleteCartDto( username )
  return response
}





module.exports = { getCartController, addProductToCartController, deleteProductFromCartController, deleteCartController }