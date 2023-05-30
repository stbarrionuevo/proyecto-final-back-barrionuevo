
# README.md 

Mi proyecto consiste en el desarrollo de un backend para un ecommerce utilizando: Express,Websocket, Nodemailer, MongoDB, Passport JWT y los patrones Factory, DAO y DTO.

# Descripción

El backend de la tienda en línea es una API REST que se encarga de gestionar los productos ,los mensajes que reciben los clientes y registrarse o iniciar sesión si es que existe un usuario ya creado. Para la persistencia de los datos se han utilizado los patrones DAO y DTO, y se ha implementado el patron Factory para seleccionar el DAO adecuado y evitar la creación de múltiples instancias.












## Instalación
Para instalar el proyecto es necesario clonar el repositorio y ejecutar el siguiente comando:


```bash
  npm install
```

Para ejecutar el proyecto, es necesario ejecutar el siguiente comando:

```bash
 npm start
```
    
## Uso

#### La API cuenta con los siguientes endpoints:

```http
/productos : dedicado para la gestion de productos
Cada endpoint acepta los métodos HTTP GET, POST, PUT y DELETE, y devuelve la respuesta del metodo solicitado.

GET -----> /productos  ; /productos/:id  ; /productos/categoria/:category

POST -----> /productos/nuevo

PUT -----> /productos/:id

DELETE -----> /productos/:id 
```

```http
/cart : dedicado para la gestion de productos en el carrito de compras y el carro en sí
Cada endpoint acepta los métodos HTTP GET, POST y DELETE, y devuelve la respuesta del metodo solicitado.

GET -----> /cart

POST -----> /cart


DELETE -----> /cart ; /cart/:id  ELIMINA EL CART COMPLETO / ELIMINA UN OBJETO DETEMINADO POR EL ID DEL CART
```

```http
/chat : dedicado para la gestion deL CHAT y de los mensajes
Cada endpoint acepta los métodos HTTP GET, POST y devuelve la respuesta del metodo solicitado.

GET -----> /chat/:username

POST -----> /chat/:msg
```

```http
/ : dedicado para la gestion de Sesiones
Cada endpoint acepta los métodos HTTP GET, POST y devuelve la respuesta del metodo solicitado.

GET -----> / ; Devuelve el usuario logeado, en caso de no estar logeado o no encontrarlo salta el error con la causa

POST -----> /login ; /logingoogle ; /register ; /logout
```




#### No es necesario ni recomendado.
-Crear un administrador de stock, dado que puede escaparse del scope y requerir bastante trabajo extra. Podremos gestionar el stock desde la base MongoDB.
-Implementar el FrontEnd salvo que así sea deseado por parte del estudiante.






```http
 /info : brinda toda la información netamente técnica, como caracteristicas de versiones, path de ejecucion o sistema operativo al usuario a través de una tabla
```

```http
 /login : permite logearse con un usuario y autenticarlo

 A su vez en este endpoint, encontramos /register (para crear usuario) 
 y /logout (para cerrar la sesion del usuario)

 Como tambien la opcion de /logingoogle (logearse a través de googleauth)
```




## Autor

- [@santiagobarrionuevo](https://github.com/stbarrionuevo/desafio-process-barrionuevo-back)

