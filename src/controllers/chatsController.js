const { getAllChatsDto, addChatMsgDto } = require('../dto/chatDTO')


const getAllChatsController = async( username) => {
  const allChats = await getAllChatsDto(username)
  return allChats
}


const addChatMsgController = async ( username, type, body ) => {
  addChatMsgDto( username, type , body )
  return 
}

module.exports = { getAllChatsController, addChatMsgController }