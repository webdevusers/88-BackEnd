const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')

router.post('/create', controller.create)
router.post('/edit', controller.edit)
router.delete('/delete', controller.delete)
router.post('/find', controller.find)
router.post('/sections', controller.populate)

module.exports = router;