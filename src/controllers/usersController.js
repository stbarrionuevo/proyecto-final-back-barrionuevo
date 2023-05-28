const { checkUserDto, addUserDto, getUserDto } = require('../dto/userDTO')
const { sendEmail } = require('../tools/sendEmail')

const validateEmail = ( email ) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return email.match(mailformat) !== null
}


const checkUserController = async( email, password ) => {
  const checkUser = await checkUserDto( email, password )
  return checkUser
}


const addUserController = async ( userData ) => {
 {const addUser = await addUserDto ( userData )
    if ( addUser ) {
      sendEmail({
        from: 'Admin',
        to: adminmail,
        subject: 'New registered user',
        text: '',
        html: `
        <table>
          <tbody>
            <tr>
              <td>Username</td>
              <td>${userData.username}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>${userData.name}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>${userData.address}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>${userData.age}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>${userData.phone}</td>
            </tr>
            <tr>
              <td>Photo</td>
              <td>${userData.photo}</td>
            </tr>
          </tbody>
        </table>`
      })
      return true
    }
  }
  return false  
}



const getUserController = async ( username ) => {
  const userData = await getUserDto( username )
  return userData 
}


const newUserController = async ( username, password ) => {
  if ( validateEmail( username ) & password ) {
    await addUserDto ( username, password )
    return true
  }
  return false  
}

module.exports = { checkUserController, addUserController, getUserController, newUserController }