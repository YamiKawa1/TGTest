const {Reservations} = require('../../../models/reservations')

// Ver todas las reservaciones las reservaciones actuales
const getReservations = (req, res) => {
    res.status(200).json({message: 'Hola'})
}

// Hacer una reservacion
const makeReservation = (req, res) => {

}

// El usuario paga la reservacion
const payReservation = (req, res) => {

}

// Cancelar la reservacion en caso de no ser concretado el pago en el tiempo estimado
const cancelReservation = (req, res) => {

}

module.exports = {
    getReservations
}
