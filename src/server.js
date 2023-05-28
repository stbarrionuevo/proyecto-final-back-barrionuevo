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
   
  //---------------------- MIDDLEWARES
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
    logger.error(`Error en la conexion a la base de datos: ${error}`)  
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
      logger.warn(`Ruta: ${req.url}, método: ${req.method} no implementada`)
      res.send(`Ruta: ${req.url}, método: ${req.method} no implementada`)
    }
  })

  return { server }
}



//CLUSTER / FORK

const startCluster = () => {
  if (cluster.isPrimary) {
    logger.info('Server in CLUSTER mode')
    logger.info('----------------------')
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
  } else {
    logger.info(`Worker ${cluster.worker.id} started`)
    PORT = config.same === 1 ? PORT + cluster.worker.id - 1 : PORT
    try {
      startServer().server.listen(PORT, () => {
        logger.info(`Worker ${cluster.worker.id} listening on port ${PORT}`)
      })
    } catch (error) {
      logger.error(`Error starting worker ${cluster.worker.id}: ${error}`)
    }
  }
}

const startFork = () => {
  logger.info('Server in FORK mode')
  logger.info('-------------------')
  try {
    startServer().server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    logger.error(`Error starting server: ${error}`)
  }
}



let PORT = ( config.port ) ? config.port : 8080 

if (config.mode === 'CLUSTER') {
  startCluster()
} else {
  startFork()
}