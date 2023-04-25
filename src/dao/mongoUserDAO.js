const connectToDB = require('../config/connectToDB')
const { userModel } = require('../model/mongoDBModel')


const bcrypt = require('bcrypt')
const saltRounds = 10


class MongoUserDAO { 


  async checkUser( email, password ) {
    try {
      await connectToDb()
      const documentInDb = await userModel.find({ email: email })
      if ( documentInDb.length > 0 ) {
        if ( bcrypt.compareSync( password, documentInDb[0].password ) ) {
          return { msg: '', result: true }
        } else {
          return { msg: 'Wrong password!!', result: false }
        }
      } 
      return { msg: 'User not found', result: false }
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

  
  async addUser( email, password ) {
    try{
      await connectToDB()
      const documentInDb = await userModel.find({ email: email })
      if ( documentInDb.length === 0 ) {
        const encriptedPassword = bcrypt.hashSync(password, saltRounds)
        await connectToDB()
        const newUser = new userModel({ email: email, password: encriptedPassword })
        await newUser.save()
          .then(user => console.log(`${user._id}`))
          .catch(err => console.log(err))
        return true
      } else {
        return false
      }
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

}


module.exports = MongoUserDAO