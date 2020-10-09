const express = require('express');
const router = express.Router();
const article_controller = require('../../controllers/articleController');

const csrf = require('csurf')
const bodyParser = require('body-parser')

var csrfProtection = csrf({ cookie: true })

router.get('/', article_controller.list);

router.get('/get/:id', csrfProtection, article_controller.edit_get);
router.post('/edit', csrfProtection, article_controller.edit_post);

router.get('/add', csrfProtection, article_controller.add_get);
router.post('/add', csrfProtection, article_controller.add_post);

router.get('/delete', csrfProtection, article_controller.delete_get);
router.post('/delete', csrfProtection, article_controller.delete_post);

module.exports = router;