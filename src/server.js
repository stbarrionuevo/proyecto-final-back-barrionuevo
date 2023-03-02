const express = require('express')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const { config, staticFiles } = require('./config/environment')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const productRouter = require('./routes/productRouter')
const sessionRouter = require('./routes/sessionRouter')
const infoRouter = require('./routes/infoRouter')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const { products } = require('./class/productContainer')
const { chats } = require('./class/chatContainer')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'))
app.use(expressSession({
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce',
    mongoOptions: advancedOptions
  }),
  secret: 'secret-pin',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))


io.on('connection', async socket => {
  console.log('Nuevo cliente conectado!')


  socket.emit('productos', await products.getAll())

  socket.on('update', async producto => {
    await products.add( producto )
    io.sockets.emit('productos', await products.getAll())
  })

  socket.emit('mensajes', await chats.getAll())


  socket.on('newMsj', async mensaje => {
      mensaje.date = new Date().toLocaleString()
      await chats.add( mensaje )
      
      io.sockets.emit('mensajes', await chats.getAll())
  })

})


app.use('/session', sessionRouter)


app.use('/api', productRouter)

app.use('/info', infoRouter)



const PORT = ( config.port) ? config.port : 8080
const server = httpServer.listen(PORT, () => {
    console.log(`-------------- SERVER READY LISTENING IN PORT ${PORT} --------------`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))