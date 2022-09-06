const {Router} = require('express')
const {getReservations} = require('./reservation.controller')

const router = new Router()

router.get('/', getReservations())

module.exports = router