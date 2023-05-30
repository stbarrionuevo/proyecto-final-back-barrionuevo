async function userLogged() { 
    let user
    await fetch(`http://localhost:${location.port}/session/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        user = data.user
      })
    return user
  }
  
  
  
  function userLoggedTemplates(user) { 
    document.querySelector('#sessionUser').innerHTML = logOkTemplate(user)
    document.querySelector('#newProduct').innerHTML = newProductTemplate()
  }
  
  
  
  function productLoad() { 
    const formulario = document.getElementById('formulario')
    formulario.addEventListener('submit', e => {
      e.preventDefault()
      const producto = {
          title: formulario[0].value,
          description: formulario[1].value,
          code: Number(formulario[2].value),
          price: Number(formulario[3].value),
          stock: Number(formulario[4].value),
          thumbnail: formulario[5].value
      }
      if (validateObject(producto)){
        alert('Complete all the product data')   
      } else {
        socket.emit('update', producto)
        formulario.reset()
      }
    })
  }
  
  
  
  async function userLogout( user ){ 
    fetch(`http://localhost:${location.port}/session/logout/`, {
      method: 'POST',
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message)
    })
  
  }
  
  
  function logged( user ){ 
    userLoggedTemplates( user )
    productLoad()
    document.getElementById("logoutBtn").addEventListener("click", ev => {
      userLogout( user )
      })
  }

  
async function cartView( userData, productsData ) { 
  let userCart
  await fetch(`http://localhost:${location.port}/api/carrito`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userData.token}`
    }
  })
  .then((response) => response.json())
  .then((data) => {
      userCart = data.products
      document.getElementById("productList").innerHTML = cartViewTemplate( userCart, productsData )
      
      document.getElementById("homeBtn").addEventListener("click", ev => {
        location.reload()
      })
      
      document.getElementById("buyBtn").addEventListener("click", async ev => {
        await fetch(`http://localhost:${location.port}/api/cart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        })
      })

    })

  return 
}



async function userLogout( userData ){ 
  fetch(`http://localhost:${location.port}/session/logout/`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${userData.token}`
    }
  })
  .then((response) => response.json())
  .then((data) => {
  })
  document.querySelector('#sessionUser').innerHTML = logByeTemplate( userData.username )
  await setTimeout(() => {
    location.reload()
  }, 2000)
}


async function productAddToCart ( itemId, userData ) { // agrega producto al carrito
  await fetch(`http://localhost:${location.port}/api/cart?itemId=${itemId}&number=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }
  })
  toast('Product added to cart', "#00800", "#ff90ee90")
  return 
}


function logged( userData, productsData ){ 
  userLoggedTemplates( userData, productsData )
 
  document.getElementById("productList").addEventListener("click", ev => {
    const productId = ev.target.id
    if ( productId.length == 24 ) {
      productAddToCart( productId, userData )
    }
  })

  document.getElementById("logoutBtn").addEventListener("click", ev => {
    userLogout( userData )
  })

  document.getElementById("cartBtn").addEventListener("click", ev => {
    cartView( userData, productsData ) 
  })
}
