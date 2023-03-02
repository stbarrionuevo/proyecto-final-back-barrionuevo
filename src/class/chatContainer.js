const connectToDd = require('../db/config/connectToDB')
const { chatModel } = require('../db/model/mongoDbModel')
const { normalizedData } = require('../normalize/normal')


class Chat { 

  constructor( schema ) {
      this.schema = schema
  }
  

  async getAll() {
    try{
      await connectToDd()
      const chatInDb = await this.schema.findOne ( { chatid: 'chat1'} )
      return normalizedData(chatInDb.chat)
    
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }
 

  async add( message ) {
    try{
      await connectToDd()
      const chatInDb = await this.schema.findOne ( { chatid: 'chat1' } )
      const newMsj = chatInDb.chat
      newMsj.push({
        user: { 
          email: message.author.id,
          name: message.author.name,
          surmame: message.author.surname,
          age: message.author.age,
          nickname: message.author.nickname,
          avatar: message.author.avatar,
        },
        message: {
          timestamp: message.date,
          text: message.text
          } 
      })
      await this.schema.updateOne({ chatid: 'chat1' },
        { $set: { chat: newMsj }}
        )
      return
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

}


const chats = new Chat ( chatModel )


module.exports = { chats }