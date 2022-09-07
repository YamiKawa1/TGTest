const {Router} = require('express');
const {
    getReservations,
    deleteReservation,
    makeReservation,
    payReservation,
    cancelReservation
} = require('./reservation.controller');

const router = Router()

router.get('/', getReservations);

router.delete('/', deleteReservation);

router.post('/make', makeReservation);

router.patch('/pay', payReservation);

router.patch('/cancel', cancelReservation);



module.exports = router