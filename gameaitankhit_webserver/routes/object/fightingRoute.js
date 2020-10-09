const express = require('express');
const router = express.Router();
const fighting_controller = require('../../controllers/fightingController');

const csrf = require('csurf')
const bodyParser = require('body-parser')

var csrfProtection = csrf({ cookie: true })

router.get('/', fighting_controller.index_get);

//router.get('/get/:id', csrfProtection, fighting_controller.edit_get);
//router.post('/edit', csrfProtection, fighting_controller.edit_post);

//router.get('/add', csrfProtection, fighting_controller.add_get);
//router.post('/add', csrfProtection, fighting_controller.add_post);

//router.get('/delete', csrfProtection, fighting_controller.delete_get);
//router.post('/delete', csrfProtection, fighting_controller.delete_post);

module.exports = router;