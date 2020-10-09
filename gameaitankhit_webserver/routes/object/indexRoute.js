var express = require('express');
var router = express.Router();
const index_controller = require('../../controllers/indexController');

router.get('/', index_controller.index_get);
router.get('/logout', index_controller.logout);
router.post('/login', index_controller.login);
router.get('/signup', index_controller.create_get);
router.post('/signup', index_controller.create_post);
router.get('/active/:id', index_controller.active_get);
router.get('/regulation', index_controller.regulation_get);
module.exports = router;