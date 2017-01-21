var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function (req, res) {
   res.send(req.csrfToken());
});
router.post('/', function (req, res) {
   var collage = req.body.collage;
   switch (collage) {
      case 'coins_26_software':
         res.sendFile(path.resolve(__dirname + '/../ref/coins_26_software.xml'));
         break;
      case 'coins_26_jyoshisu':
         res.sendFile(path.resolve(__dirname + '/../ref/coins_26_jyoshisu.xml'));
         break;
      case 'coins_26_intelligence':
         res.sendFile(path.resolve(__dirname + '/../ref/coins_26_intelligence.xml'));
         break;
   }
});
module.exports = router;