const express = require('express');
const router = express.Router();
const bot_controller = require('../../controllers/botController');

const csrf = require('csurf')
const bodyParser = require('body-parser')

var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, bot_controller.list);

router.post('/create', csrfProtection, bot_controller.create_post);

router.post('/select', csrfProtection, bot_controller.select_post);

module.exports = router;