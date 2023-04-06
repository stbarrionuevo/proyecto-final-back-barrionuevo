function validateEmail(email) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(mailformat)) {
      return true
    } else {
      toast('Debe ingresar un email valido', "#f75e25", "#ff4000")
      return false
    }
  }