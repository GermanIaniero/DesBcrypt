import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
/*socketio


const ChatManager = require("./dao/remote/managers/chat/chatManager")
const chatManager = new ChatManager() */


import sessionRouter from './routes/session.router.js'
import viewsRouter from './routes/views.router.js'

import __dirname from './utils.js'

import passport from 'passport'
import initializePassport from './config/passport.config.js'
//import jwtRouter from './routes/jwt.router.js'

const app = express()
const uri = 'mongodb+srv://gerlian:1234@clusterger.mgws5uk.mongodb.net/'
const dbName = 'Login'


// CONFIGURACION HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Configuracion para usar JSON en el post
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// CONFIGURACION MONGO SESSIONS
app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 15
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/session', sessionRouter)
app.get('/health', (req, res) => res.send(`<h1>OK</h1>`))
app.use('/', viewsRouter)


// static files
app.use('/static', express.static(__dirname + '/public'))

mongoose.connect(uri, {dbName})
    .then(() => {
        console.log('Connected')
        app.listen(8080, () => console.log('Listeing...'))
    })
    .catch(e => console.error(e))
    
/*const io = new Server(httpServer);    

io.on("connection", (socket) => {
  console.log(`New user ${socket.id} joined`);

  //Recibe del front
  socket.on("client:newProduct", async (data) => {
    const { title, description, price, code, stock, category } = data;

    const thumbnail = Array.isArray(data.thumbnail)
      ? data.thumbnail
      : [data.thumbnail];

    if (!title || !description || !price || !code || !stock || !category) {
      console.log("All fields are required");
    }

    const product = {
      title,
      description,
      price: Number(price),
      thumbnail,
      code,
      stock: Number(stock),
      category,
    };

    await productManager.addProduct(product);

    //Envia el back
    const products = await productManager.getProducts();
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  //Recibe del front
  socket.on("client:deleteProduct", async (data) => {
    const id = data;

    const logicalDeleteProduct = await productManager.logicalDeleteProduct(id);

    //Envia el back
    const products = await productManager.getProducts();

    //Solo para mostrar los productos con status true
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  //Recibe del front
  socket.on("client:message", async (data) => {
    await chatManager.saveMessage(data)
    //Envia el back
    const messages = await chatManager.getMessages()
    io.emit("server:messages", messages)
  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
}); */