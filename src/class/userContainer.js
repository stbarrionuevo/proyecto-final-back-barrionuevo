const connectToDd = require('../db/config/connectToDB')
const { userModel } = require('../db/model/mongoDbModel')

const bcrypt = require('bcrypt')
const saltRounds = 10


class User {

  constructor( schema ) {
      this.schema = schema
  }
  

  async checkUser( email, password ) {
    try {
      await connectToDd()
      const documentInDb = await this.schema.find({ email: email })
      if ( documentInDb.length > 0 ) {
        if ( bcrypt.compareSync( password, documentInDb[0].password ) ) {
          return { msg: '', result: true }
        } else {
          return { msg: 'Incorrect password', result: false }
        }
      } 
      return { msg: 'User not found / not exists', result: false }
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

  
  async addUser( email, password ) {
    try{
      await connectToDd()
      const documentInDb = await this.schema.find({ email: email })
      if ( documentInDb.length === 0 ) {
        const encriptedPassword = bcrypt.hashSync(password, saltRounds)
        await connectToDd()
        const newUser = new userModel({ email: email, password: encriptedPassword })
        await newUser.save()
          .then(user => console.log(`added: ${user._id}`))
          .catch(err => console.log(err))
        return true
      } else {
        return false
      }
    } catch(err) {
      console.log(`Fatal error: ${err}`)
    }
  }

}


const users = new User( userModel )

module.exports = { users } 