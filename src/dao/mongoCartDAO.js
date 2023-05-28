const connectToDB = require('../config/connectToDB')
const { cartModel } = require('../model/mongoDBModel')

const { logger, loggererr } = require('../log/logger')

class MongoCartDAO {

  async newCart( username, address ) {
    try {
      await connectToDB()
      const newCart = new cartModel({ 
        username: username,
        address: address,
        products: []
      })
      const result = await newCart.save()
      return result
    } catch (err) {
      loggererr(err)
    }
  }


  async getByUsername( username ) {
    try {
      await connectToDB()
      const cart = await cartModel.findOne({ username: username })
      return cart
    } catch (err) {
      logger.warn(`Can't find the cart ERROR: ${err}.`)
      return false
    }
  }


  async addProductToCart( itemId, number, username ) {
    try {
      await connectToDB()
      const response = await cartModel.findOneAndUpdate(
        { username: username, "products.id": itemId },
        { $inc: { "products.$.number": number } },
        { new: true }
      )
      if (!response) {
        await cartModel.findOneAndUpdate(
          { username: username },
          { $push: { products: { id: itemId, number: number } } },
          { new: true }
        )
      }
      return true
    } catch (err) {
      logger.warn(`Can't to add product to cart. ERROR: ${err} .`)
      return false
    }
  }
  
  async delProductFromCart( itemId, username ) {
    try {
      await connectToDB()
      const response = await cartModel.findOneAndUpdate(
        { username: username },
        { $pull: { products: { id: itemId } } },
        { new: true }
      )
      return response ? true : false
    } catch (err) {
      logger.warn(`Can't delete product from cart! ERROR: ${err} .`) 
      return false
    }
  }

  async delCart( username ) {
    try {
      await connectToDB()
      const response = await cartModel.findOneAndUpdate(
        { username: username },
        { $set: { products: [],
                  timestamp: new Date().getTime() 
                }
         }
      )
      return response ? true : false
    } catch (err) {
      logger.warn(`CANNOT attempt to delete cart. ERROR:${err}.`)
      return false
    }
  }
}

module.exports = MongoCartDAO