module.exports = function (express, app) {

   let router = express.Router();

   // var app = express();
   let path = require('path');

   /* get stylesheet file. */
   app.use('/', express.static(path.resolve(__dirname + '/../public/stylesheets')));

   return router;
};
