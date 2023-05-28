const getDAO = require('../dao/factory')


const getAllChatsDto = async() => {
  const chats = await ( await getDAO()).chats
  const allChats = await chats.getAll()
  return allChats
}

const addChatMsgDto = async( message ) => {
  const chats = await ( await getDAO()).chats
  await chats.add( message )
  return 
}



module.exports = { getAllChatsDto, addChatMsgDto }