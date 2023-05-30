const sessionUserHtmlElement = document.querySelector('#sessionUser')
const productListHtmlElement = document.querySelector('#productList')
const registerFormHtmlElement = document.querySelector('#registerForm')




async function main(){
  let userData = await userLogged() 
  
  if ( userData !== null ) {
    const productsData = await allProducts()
    logged( userData, productsData ) 
  } else {
    
    sessionUserHtmlElement.innerHTML = loginTemplate()
    const logUser = document.getElementById("logUser")
    const logPassword = document.getElementById("logPassword")
   
    document.getElementById("loginBtn").addEventListener("click", async ( ev ) => { 
      if ( validateObject ({ usuario: logUser.value , clave: logPassword.value })) {  
      } else { 
        const response = await fetch(`http://localhost:${location.port}/session/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: logUser.value,
            password: logPassword.value
          })
        })
        
          userData = await response.json()
          const productsData = await allProducts()
          logged( userData, productsData ) 
        
      
      }
    })
    

    document.getElementById("registerBtn").addEventListener("click", ev => {
      registerNewUser(sessionUserHtmlElement)
    }) 

  }
}




main()