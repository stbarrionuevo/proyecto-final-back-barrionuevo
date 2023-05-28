const { v4: uuidv4 } = require('uuid')

class MemoryProductDAO { 

  constructor( productList ) {
      this.productList = productList
  }
  

  getAll() {
    return this.productList
  }
 

  getById( id ) {
    const product = this.productList.find( ele => ele.id === id )
    return product ? product : null
  }


  deleteById( id ) {  
    this.productList = this.productList.filter( ele => ele.id !== id )
    return 
  }


  deleteAll() {
    this.productList = []
    return
  }


  add( item ) {
    item.id = uuidv4()
    this.productList.push( item )
    return
  }

  modifyById( id, item ) {
    const index = this.productList.findIndex( ele => ele.id === id )
    if ( index >= 0 ) {
      console.log('New Item', item)
      console.log('Old Item', this.productList[index])
      this.productList[index].title = item.title
      this.productList[index].description = item.description
      this.productList[index].code = item.code
      this.productList[index].price = item.price
      this.productList[index].stock = item.stock
      this.productList[index].thumbnail = item.thumbnail
      console.log(`Product update! Thenew ID is: ${id}`)
      return true
    } else {
      console.log(`ID: ${id} not found`)
      return false
    }
  }

}


module.exports = MemoryProductDAO