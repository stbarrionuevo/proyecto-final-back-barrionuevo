const mongoose = require('mongoose')

let isConected

const connectToDB = async () => {
  if(!isConected) {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGOURL,
    { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          isConected = true
          console.log('MongoDB Connected...')})
        .catch(err => console.log(err))   
    return
  }

  console.log("Established Connection!!!")
  return
}

module.exports = {connectToDB}