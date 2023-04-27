const { persistence } = require('../config/environment')
const MongoProductDAO = require('./mongoProductDAO')
const MongoUserDAO = require('./mongoUserDAO')
const MongoChatDAO = require('./mongoChatDAO')
const MemoryProductDAO = require('./memoryProductDAO')
const MemoryUserDAO = require('./memoryUserDAO')
const MemoryChatDAO = require('./memoryChatDAO')



let productsDAO = undefined,
  usersDAO = undefined,
  chatsDAO = undefined

const getDAO = async() => {
  if( !productsDAO ) {
    if ( persistence === 'MEMORY' ) {
      productsDAO = new MemoryProductDAO([])
      usersDAO = new MemoryUserDAO([])
      chatsDAO = new MemoryChatDAO({ chat: [] })
    } else {
      productsDAO = await new MongoProductDAO()
      usersDAO = await new MongoUserDAO()
      chatsDAO = await new MongoChatDAO()
    }
  }
  return {
    products: productsDAO,
    users: usersDAO,
    chats: chatsDAO
  }
}


module.exports = { getDAO }