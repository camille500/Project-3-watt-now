/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const path = require('path');
const request = require('request');
const session = require('express-session');
const compression = require('compression');
const bodyParser = require('body-parser');

/* DEPENDENCIES CONFIGURATION
----------------------------------------- */
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('dotenv').config();

/* MONGODB CONFIGURATION
----------------------------------------- */
const MongoClient = require('mongodb').MongoClient;
const dbConfig = process.env.MONGODB_URI;

MongoClient.connect(dbConfig, (err, database) => {
  if (err)
    return console.log(err)
  db = database
});

/* SESSIONS CONFIGURATION
----------------------------------------- */
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: true
}));

io.on('connection', function (socket) {
    console.log('hi');
    setInterval(function() {
        getKwh();
        getTarget();
  }, 10000);
});

/* SETUP URL JSON
----------------------------------------- */
function getKwh() {
  request({
      url: 'http://104.131.106.189/kwh',
      json: true
  }, function (error, response, body) {
      const data = body;
      console.log(data.actualKwh);
      io.emit('kwh', data.actualKwh);
      if (!error && response.statusCode === 200) {
          console.log('error');
      }
  });
}

function getTarget() {
  request({
      url: 'http://104.131.106.189/',
      json: true
  }, function (error, response, body) {
      const data = body;
      console.log(data.total);
      io.emit('total', data.total);
      if (!error && response.statusCode === 200) {
          console.log('error');
      }
  });
}



/* SET PORT FOR HEROKU
----------------------------------------- */
const port = process.env.PORT || 3000;

/* ENABLE CACHE AND COMPRESSION
----------------------------------------- */
app.set('view cache', true);
app.use(compression());

/* LOAD ALL ROUTERS
----------------------------------------- */
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const dashboardRouter = require('./routes/dashboard');
const graphRouter = require('./routes/graph');

/* MIDDLEWARE FOR THE VIEW ENGINE
----------------------------------------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* BODY-PARSER FOR READING POST REQUESTS
----------------------------------------- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* INITIALIZE ROUTES
----------------------------------------- */
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/dashboard', dashboardRouter);
app.use('/graph', graphRouter);

/* 404 PAGE
----------------------------------------- */
app.enable('verbose errors');
app.use(function(req, res, next) {
  res.render('404');
});

/* START THE NPM SERVER
----------------------------------------- */
http.listen(port, function() {
  console.log(`Server started`);
});
