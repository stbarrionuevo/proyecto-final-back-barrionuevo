const express = require('express')
const expressSession = require('express-session')

const { logger, loggererr } = require('../log/logger')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')
const { config, staticFiles } = require('../config/environment')


const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const baseProcces = () => {

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Proceso ${worker.process.pid} caido!`)
    cluster.fork()
  })}



const productRouter = require('./routes/productRouter')
const sessionRouter = require('./routes/sessionRouter')
const infoRouter = require('./routes/infoRouter')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)


const { newProductController, getAllProductsController } = require('./controllers/productsController')
const { getAllChatsController, addChatMsgController } = require('./controllers/chatsController')


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
  console.log('New connection!')


  socket.emit('productos', await getAllProductsController())

  socket.on('update', async producto => {
    await newProductController( producto )
    io.sockets.emit('productos', await getAllProductsController())
  })

  socket.emit('mensajes', await getAllChatsController())


  socket.on('newMsj', async mensaje => {
      mensaje.date = new Date().toLocaleString()
      await addChatMsgController( mensaje )
      
      io.sockets.emit('mensajes', await getAllChatsController())
  })

})


app.use('/session', sessionRouter)
app.use('/api', productRouter)
app.use('/info', infoRouter)



let PORT = ( config.port) ? config.port : 8080 

  if ( config.mode === 'CLUSTER') { 
    PORT = config.same === 1 ? PORT + cluster.worker.id - 1 : PORT
  } 

const server = httpServer.listen(PORT, () => {
    console.log(`-------------- SERVER READY LISTENING IN PORT ${PORT} --------------`)
})
server.on('error', error => console.log(`ERROR IN SERVER ${error}`))



if ( config.mode != 'CLUSTER' ) { 

 
  console.log('Server FORK')
  baseProcces()
  } else { 

 
    if (cluster.isPrimary) {
      console.log('SERVER CLUSTER')
   
      for (let i = 0; i < numCPUs; i++) { 
        cluster.fork()
      }
    } else {
      baseProcces()
    }
  }

