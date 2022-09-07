const {Router} = require('express')
const {getReservations} = require('./reservation.controller')

const router = Router()

router.get('/', getReservations);
// router.post('/', makeReservation);
// router.patch('/pay', payReservation);
// router.patch('/cancel', cancelReservation);


module.exports = router