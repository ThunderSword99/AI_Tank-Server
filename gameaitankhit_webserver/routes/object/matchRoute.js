var express = require('express');
var router = express.Router();
const match_controller = require('../../controllers/matchController');

router.get('/', match_controller.list_get);

router.get('/:id', match_controller.detail_get);

router.get('/newGame/:id', match_controller.newGame);

router.get('/fightBack/:id', match_controller.fight_back);

router.post('/fight-by-admin', match_controller.fight_by_admin_post);

module.exports = router;