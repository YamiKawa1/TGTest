const {Reservations} = require('../../../models/reservations');
const { States } = require('../../../models/states');
const {Clients} = require('../../../models/clients');
const {generalReturnMessage, internalErrorMessage} = require('../../../messages/messages')

// Ver las reservaciones las reservaciones actuales
const getReservations = async(req, res) => {
    try {
        const {state, idDocument} = req.body

        if (state) { // Si se pasa la variable state, se filtraran por el estado de la reservacion en caso de ser necesario
            // const foundState = await States.findOne({where: { name: state } });
            var foundReservations = await Reservations.findAll({ include: {model: States, where: { id: state } } });

        } else if(idDocument){ // Si se pasa la variable idDocument, se filtraran por el estado de la reservacion en caso de ser necesario 
            var foundReservations = await Reservations.findAll({ include: {model: Clients, where: { idDocument: idDocument } } });
            
        } else { // En caso de no haber un filtro, se pasan todas las reservaciones
            var foundReservations = await Reservations.findAll()
        }

        // Verifica que no exista reservacion
        if (foundReservations.length >= 0) return generalReturnMessage(res, 204, 'There is not reservations')

        return generalMessage(res, 200, 'Reservations', foundReservations)

    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'getReservations', error)
    }
    
}

// Hacer una reservacion, esto es la primera parte de la reservacion, 
// donde se piden todos los datos y pasa al estado pendiente
const makeReservation = (req, res) => {
    try {
        const {
            // datos de la factura
            room_id,
            total,
            // datos de clientes
            fullname,
            idDocument,
            email,
            phone,
            // datos de la reservacion 
            payMethod,
            entryDate,
            exitDate,
            peopleQantity
        } = req.body
    // No se puede hacer una reservacion en la misma habitacion que otra persona ya tiene una reservacion en el mismo tiempo

        return generalReturnMessage(res, 201, 'Reservation Made', reservationInfo)
    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'makeReservation', error)
    }

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
    getReservations,
    makeReservation,
    payReservation,
    cancelReservation
}
