const connectToDB = require('../config/connectToDB')
const { productModel } = require('../model/mongoDBModel')


class MongoProductDAO {

  
  async getAll() {
    try{
      await connectToDB()
      const documentsInDb = await productModel.find()
      return documentsInDb
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }
 

  async getById( id ) {
    try {
      await connectToDB()
    
      const documentInDb = await productModel.find({_id: id})
      return documentInDb ? documentInDb : null

    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }


  async deleteById( id ) {  
    try {
      await connectToDB()
     
      await productModel.deleteOne({ _id: id })
      return 
    } catch(err) {
      console.log(`Error: ${err}`)
      return false
    }
  }


  async deleteAll() {
    try {
      await connectToDB()
      await productModel.deleteMany()
      return 
    } catch(err) {
      console.log(`Error: ${err}`)
      return false
    }
  }


  async add( item ) {
    try{
      await connectToDB()
      const newProduct = new productModel( item )
      await newProduct.save()
        .then(product => console.log(`${product._id}`))
        .catch(err => console.log(err))
      return
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

  
  async modifyById( id, item ) {  
    try {
      await connectToDb()
      const result = await productModel.findByIdAndUpdate(id, item)
      if (result !== null){
        console.log(`Se ha actualizado el elemento con id: ${id}`)
        return true
      } else {
        console.log(`No se ha encontrado ningún elemento con id: ${id}`)
        return false
      }
    } catch(err) {
      console.log(`Error: ${err}`)
      return false
    }
  }

}




module.exports = MongoProductDAO