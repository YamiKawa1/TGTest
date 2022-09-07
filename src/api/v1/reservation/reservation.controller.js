const {Reservations} = require('../../../models/reservations');
const { States } = require('../../../models/states');
const {generalReturnMessage, internalErrorMessage} = require('../../../messages/messages')

// Ver todas las reservaciones las reservaciones actuales
const getReservations = async(req, res) => {
    try {
        // Si se pasa la variable state, se filtraran por el estado de la reservacion
        const {state} = req.body
        if (state) {
            const state = await States.findOne({where: { name: state } });
            console.log('state:', state);

            var foundReservations = await Reservations.findAll({
                where: {
                    state_id: state.id
                }
            });

            console.log(foundReservations);
        } else {
            var foundReservations = await Reservations.findAll()
            console.log('blah', foundReservations);
        }

        if (foundReservations.length >= 0) return generalReturnMessage(res, 204, 'There is not reservations')

        return generalMessage(res, 200, 'Reservations', foundReservations)

    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'getReservations', error)
    }
    
}

// Hacer una reservacion
const makeReservation = (req, res) => {
    try {
        const {

        } = req.body
        return generalMessage(res, 201, 'Reservation Made', foundReservations)
    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'getReservations', error)
    }
    res.status(200).json({message: 'Reservation Made'})

}

// El usuario paga la reservacion
const payReservation = (req, res) => {
    res.status(200).json({message: 'Reservation Payed'})

}

// Cancelar la reservacion en caso de no ser concretado el pago en el tiempo estimado
const cancelReservation = (req, res) => {
    res.status(200).json({message: 'Reservation Canceled'})

}

module.exports = {
    getReservations
}
