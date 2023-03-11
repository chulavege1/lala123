var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const https = require("https");


var cors = require('cors')
const bodyParser = require('body-parser');

//
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Configuring express to use body-parser
// as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.cyberial.app/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.cyberial.app/fullchain.pem')
};

https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS server running on port 3000');
});

app.listen(4000, () => {
  console.log('HTTP server running on port 80');
});

// Get request for root of the app
app.get("/", function (req, res) {
  // Sending index.html to the browser
  res.sendFile(__dirname + "/views/index.jade");
});

// cors
app.use(cors())

// Разрешаем доступ только от указанных источников
// app.use(cors({
//   origin: ['http://localhost:5003/#/', 'https://cyberial.app/'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
// }));


app.use('/', indexRouter);
// app.use('/example/b', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
