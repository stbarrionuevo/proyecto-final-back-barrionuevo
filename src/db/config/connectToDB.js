const mongoose = require('mongoose')

let isConected

const connectToDd = async () => {
  if(!isConected) {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce',
    { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          isConected = true
          console.log('MongoDB Connected...')})
        .catch(err => console.log(err))   
    return
  }

  console.log("Conexion existente")
  return
}

module.exports = connectToDd 