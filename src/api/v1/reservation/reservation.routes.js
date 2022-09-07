const {Router} = require('express')
const {
    getReservations,
    makeReservation,
    payReservation,
    cancelReservation
} = require('./reservation.controller')

const router = Router()

router.get('/', getReservations);
router.post('/make', makeReservation);
router.patch('/pay', payReservation);
router.patch('/cancel', cancelReservation);


module.exports = router