module.exports = function(express, app) {

   var router = express.Router();

   // var app = express();
   var path = require('path');

   /* get stylesheet file. */
   app.use('/', express.static(path.resolve(__dirname + '/../public/stylesheets')));

   return router;
}