const express = require('express')
const expressSession = require('express-session')

const { logger, loggererr } = require('./log/logger')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }


const { ApolloServer } = require('@apollo/server')
const { typeDefs } = require('../graphql/typeDefs')
const { resolvers } = require('../graphql/resolvers')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')
const { config, staticFiles } = require('./config/environment')


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
app.use(express.static(staticFiles))
app.use(expressSession({
  store: MongoStore.create({
    mongoUrl: process.env.MONGOSESSION,
    mongoOptions: advancedOptions
  }),
  secret: 'secret-pin',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

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


app.get('*', (req, res) => {
  logger.warn(`Ruta: ${req.url}, metodo: ${req.method} no implemantada`)
  res.send(`Ruta: ${req.url}, metodo: ${req.method} no implemantada`)
})



let PORT = ( config.port) ? config.port : 8080 

  if ( config.mode === 'CLUSTER') { 
    PORT = config.same === 1 ? PORT + cluster.worker.id - 1 : PORT
  } 



  server.start()
  .then(() => {
    app.use('/graphql',
      expressMiddleware(server,
      { context: () => ({ isUserAuthorized: 'OK' })} )
    )
    app.get('*', (req, res) => {
      logger.warn(`Ruta: ${req.url}, metodo: ${req.method} no implemantada`)
      res.send(`Ruta: ${req.url}, metodo: ${req.method} no implemantada`)
    })
    
    app.listen(PORT, () => console.log(`-------------- SERVER READY LISTENING IN PORT ${PORT} --------------`))
  })

  



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
  
