const { getAllChatsDto, addChatMsgDto } = require('../dto/chatDTO')


const getAllChatsController = async() => {
  const allChats = await getAllChatsDto()
  return allChats
}


const addChatMsgController = async ( message ) => {
  addChatMsgDto( message )
  return 
}

module.exports = { getAllChatsController, addChatMsgController }