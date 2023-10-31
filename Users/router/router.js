const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')

router.get('/all', controller.getUsers)
router.post('/get', controller.getUser)
router.post('/signup', controller.Registration)
router.post("/signin", controller.authenticate)
router.post('/change', controller.changeStatus)
router.post('/verify', controller.personalAreaSign)
router.post('/rating', controller.setRating)
router.post('/delete', controller.deleteUser)
router.post('/order/add', controller.addOrders)
router.post('/delivery', controller.addDeliveryAddress)
router.post('/views', controller.views)
router.post('/views/get', controller.getViews)
router.post('/favorites', controller.favorites)
router.post('/favorites/get', controller.getFavorites)
router.post('/cart', controller.cart)
router.post('/cart/get', controller.getCart)

module.exports = router;