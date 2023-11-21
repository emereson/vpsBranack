const express = require('express');
const app = express();
const http = require('http').Server(app);
const redisAdapter  = require('socket.io-redis');
require('dotenv').load();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const whiteBoardHandling = require('./socketsConnections/whiteBoardHandling');
const chatConnectionswhiteBoard = require('./socketsConnections/chatPublicWhiteBoard.js');
const chatConnections = require('./socketsConnections/newHomeChatConnections.js');
const mongo = require('./models/initMongo');

const io = require('socket.io')(http,  {
  pingInterval: 10000,
  pingTimeout: 5000,
});

// set up redis for websocket clustering in aws production
if (process.env.NODE_ENV === "production-aws") {
    useredisAdapter();
}

function useredisAdapter(){
  const adapter = redisAdapter ({ host: process.env.REDIS_HOST, port: 6379 , });
  io.adapter(adapter);
}

const {PORT} = process.env;

/* CORS configuration*/
const enableCors  = (app) => {
  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
    res.append(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept,Authorization',
    );
    if (req.method === 'OPTIONS') {
      return res.send(200);
    }
    next();
  });
}

const initServer = async() =>{

  enableCors(app);
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb', extended: true }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Initialize mongoDB connection
  try {
    await mongo.connect();
  } catch(error) {
    console.error("error connecting to Mongo" , error);
  }

  
  // Cloud9 + Heroku || localhost
  const port = PORT || 8181;

  whiteBoardHandling(io);
  chatConnections(io);
  chatConnectionswhiteBoard(io);


  app.use('/booking', require('./routes/booking'));
  app.use('/contact', require('./routes/contact'));
  app.use('/email/landingpage', require('./routes/form.email.landingpage'));
  //conect to api twilio
  app.use('/token', require('./routes/videoConference'));



  // Health check
  app.get('/', function (req, res) {
    res.send("ok");
  })

  http.listen(port, function () { console.log('listening on : ' + port); });
  
}

initServer();





