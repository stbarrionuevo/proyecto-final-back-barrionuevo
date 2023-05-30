function registerNewUser(sessionUserHtmlElement) {
  sessionUserHtmlElement.innerHTML = registerNewUserTemplate()

  const name = document.getElementById('name')
  const user = document.getElementById('email')
  const address = document.getElementById('address')
  const age = document.getElementById('age')
  const phoneInput = document.querySelector("#phone")
  const password = document.getElementById('password')
  const passwordConf = document.getElementById('passwordConf')
  const registerBtn = document.getElementById('registerBtn')
  const cancelRegisterBtn = document.getElementById('cancelRegisterBtn')

  registerBtn.addEventListener("click", ev => {

    const phoneNumber = phoneInput.getNumber() 
    if( !validateObject ({
          name: name.value,
          direccion: address.value,
          edad: age.value,
          telefono: phoneNumber,
          contrasena: password.value
        })
        & validateEmail( user.value )
        & ( password.value === passwordConf.value )
        ){

    
        fetch(`http://localhost:${location.port}/session/register/`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: email.value,
            password: password.value,
            name: name.value,
            address: address.value,
            age: age.value,
            phone: phoneNumber,
          })
        })
        .then(response => {
          if( response.status === 401 ){
           
          } else {

            fetch(`http://localhost:${location.port}/session/login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: email.value,
                password: password.value
              })
            })
            .then( response => { 
              location.reload()
            })
            .catch(error => {
              console.log('FATAL ERROR: ', error)
            })
          }
        })

    } 
  })

  cancelRegisterBtn.addEventListener("click", ev => {
    location.reload()
  })

}