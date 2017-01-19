var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var lusca = require('lusca');
var session = require('express-session');

var index = require('./routes/index');
var request = require('./routes/request');
// var users = require('./routes/users');

var app = express();

// var stylesheets = require('./routes/stylesheets')(express, app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configration for security
app.use(helmet());
app.use(session({
   secret: '5w4F5pHJemXv',
   resave: false,
   saveUninitialized: true
}));
app.use(lusca.csrf());

app.get('/', index);

/* reqiurement data request */
app.get('/endpoint', function (req, res) {
   res.send(req.csrfToken());
});
app.post('/endpoint', request);

// app.use('/users', users);

/* stylesheet routing */
app.use('/css', express.static(path.resolve(__dirname + '/public/stylesheets')));

/* javascript routing */
app.get('/js/material.min.js', function(req, res, next) {
   res.sendFile(path.resolve(__dirname + '/node_modules/material-design-lite/material.min.js'));
});
app.use('/js', express.static(path.resolve(__dirname + '/public/javascripts')));

/* image routing */
app.use('/images', express.static(path.resolve(__dirname + '/public/images')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');

   console.log(res.locals.message);
});

module.exports = app;