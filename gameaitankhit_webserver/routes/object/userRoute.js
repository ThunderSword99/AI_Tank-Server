const express = require('express');
const router = express.Router();
const user_controller = require('../../controllers/userController');

const csrf = require('csurf')
const bodyParser = require('body-parser')

var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, user_controller.list);

router.get('/get/:id', csrfProtection, user_controller.edit_get);
router.post('/edit', csrfProtection, user_controller.edit_post);

router.get('/add', csrfProtection, user_controller.add_get);
router.post('/add', csrfProtection, user_controller.add_post);

router.get('/lock', csrfProtection, user_controller.lock_get);
router.post('/lock', csrfProtection, user_controller.lock_post);

module.exports = router;