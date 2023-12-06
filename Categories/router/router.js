const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')

router.post('/create', controller.create)
router.post('/edit', controller.edit)
router.delete('/delete', controller.delete)
router.get('/all', controller.all)
router.post('/find', controller.find)
router.post('/subcategories', controller.populate)
router.get('/getAll', controller.actionBar)

module.exports = router;