const {Router} = require('express');
const ReservationCtrl = require('./reservation.controller');

const router = Router()

router.get('/', ReservationCtrl.getReservations);

router.delete('/', ReservationCtrl.deleteReservation);

router.post('/make', ReservationCtrl.makeReservation);

router.patch('/pay', ReservationCtrl.payReservation);

router.patch('/cancel', ReservationCtrl.cancelReservation);



module.exports = router