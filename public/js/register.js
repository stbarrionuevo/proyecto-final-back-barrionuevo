const logName = document.getElementById('logName')
const logPassword = document.getElementById('logPassword')

document.getElementById("registerBtn").addEventListener("click", ev => {
  if ( validateObject ({ a: logName.value , b: logPassword.value })) {
    toast('Complete ALL THE FORM before send it', "#f75e25", "#ff4000")
  } else {
    if ( validateEmail( logName.value )) {
      fetch(`http://localhost:8080/session/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: logName.value,
          password: logPassword.value
        })
      })
      .then(response => {
        if ( response.status === 401 ){
          toast("USER ALREADY EXISTS", "#f75e25", "#ff4000")
      
        } else { 

          fetch(`http://localhost:8080/session/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: logName.value,
              password: logPassword.value
            })
          })
          .then( response => { 
            location.href = 'index.html'
          })
          .catch(error => {
            console.log('FATAL ERROR : ', error)
          })
        }
      })
    }
  }


})