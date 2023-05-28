const getDAO = require('../dao/factory')

const getUserDto = async( username ) => {
  const users = await (await getDAO()).users
  const userData = await users.getUser( username )
  return userData  
}

const checkUserDto = async( email, password ) => {
  const users = await ( await getDAO()).users
  const userCheck = await users.checkUser( email, password )
  return userCheck
}

const addUserDto = async( email, password ) => {
  const users = await ( await getDAO()).users
  const newUser = await users.addUser( email, password )
  return newUser
}



module.exports = {  getUserDto,checkUserDto, addUserDto }