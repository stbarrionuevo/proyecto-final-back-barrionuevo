const { config, staticFiles } = require('./config/environment')
const { logger, loggererr } = require('./log/logger')
const express = require('express')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const http = require('http')
const { Server: Socket } = require('socket.io')
const io = new Socket(httpServer)

const mongoStore = require('connect-mongo')
const expressSession = require('express-session')
const advancedOptions = {useNewUrlParser: true,useUnifiedTopology: true}
const { engine } = require('express-handlebars')

const path = require ("path")

//rOUTERS
const productRouter = require('./routes/productRouter')
const cartRouter = require('./routes/cartRouter')
const chatRouter = require('./routes/chatRouter.js')
const sessionRouter = require('./routes/sessionRouter')
const infoRouter = require('./routes/infoRouter')



// Function server

const startServer = () => {

  const app = express()
  const server = http.createServer(app)
 

  app.set('views', path.resolve(__dirname, '../views'))
  app.engine('hbs', engine({ extname: 'hbs' }))
  app.set('view engine', 'hbs')
   
  //MIDDLEWARES
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(staticFiles))
  try {
    app.use(expressSession({
      store: mongoStore.create({
        mongoUrl: mongocredentialsession,
        mongoOptions: advancedOptions
      }),
      secret: 'secret-pin',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(usersessiontime)
      }
    }))
  } catch (error) {
    logger.error(`
    Database connection error: ${error}`)  
  } 

  //SOCKET
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

  //USE ROUTES

  app.use('/session', sessionRouter)


  app.use('/api', productRouter)


  app.use('/api', cartRouter)


  app.use('/api', chatRouter)

  app.use('/info', infoRouter)



  //Routes NO implementadas

  app.get('*', (req, res, next) => {
    const fileExtension = path.extname(req.url)
    if (fileExtension === '.ico') {
      next()
    } else {
      logger.warn(`Route: ${req.url}, method: ${req.method} not implemented`)
      res.send(`Route: ${req.url}, method: ${req.method} not implemented`)
    }
  })

  return { server }
}



//CLUSTER / FORK

const startCluster = () => {
  if (cluster.isPrimary) {
    logger.info('SERVER CLUSTER MODE')
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
  } else {
    logger.info(`CLUSTER STARTS ${cluster.worker.id}`)
    PORT = config.same === 1 ? PORT + cluster.worker.id - 1 : PORT
    try {
      startServer().server.listen(PORT, () => {
        logger.info(`-----------CLUSTER ${cluster.worker.id} IN PORT: ${PORT}-----------`)
      })
    } catch (error) {
      logger.error(`ERROR ATTEMPTING TO START SERVER ${cluster.worker.id}: ${error}`)
    }
  }
}

const startFork = () => {
  logger.info('SERVER FORK MODE')
  try {
    startServer().server.listen(PORT, () => {
      logger.info(`-----------SERVER FORK LISTEN IN PORT: ${PORT}--------------`)
    })
  } catch (error) {
    logger.error(`ERROR ATTEMPTING TO START SERVER: ${error}`)
  }
}



let PORT = ( config.port ) ? config.port : 8080 

if (config.mode === 'CLUSTER') {
  startCluster()
} else {
  startFork()
}