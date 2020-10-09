var express = require('express');
var router = express.Router();
var player_controller =  require('../../controllers/playerController');

router.get('/', player_controller.list);
router.post('/', player_controller.findPlayer);

module.exports = router;