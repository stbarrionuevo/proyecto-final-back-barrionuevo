const { persistence } = require('../config/environment')
const MongoProductDAO = require('./mongoProductDAO')
const MongoUserDAO = require('./mongoUserDAO')
const MongoChatDAO = require('./mongoChatDAO')
const MongoCartDAO = require('./mongoCartDAO')
const MemoryProductDAO = require('./memoryProductDAO')
const MemoryUserDAO = require('./memoryUserDAO')
const MemoryChatDAO = require('./memoryChatDAO')



let productsDAO = undefined,
  usersDAO = undefined,
  chatsDAO = undefined,
  cartsDAO= undefined

  const initDAO = async () => {
    if (persistence === 'MEMORY') {
      productsDAO = new MemoryProductDao([])
      cartsDAO = new MemoryCartDao({ cart: [] })
      usersDAO = new MemoryUserDao([])
      chatsDAO = new MemoryChatDao({ chat: [] })
      logger.info('Persistencia en memoria')
    } else {
      productsDAO = await new MongoProductDao()
      cartsDAO = await new MongoCartDao()
      usersDAO = await new MongoUserDao()
      chatsDAO = await new MongoChatDao()
      logger.info('Persistencia en MongoDb')
    }
  }
  
  const getDAO = async () => {
    if (!productsDAO) {
      await initDAO()
    }
    return {
      products: productsDAO,
      carts: cartsDAO,
      users: usersDAO,
      chats: chatsDAO,
    }
  }
  

module.exports = { getDAO }