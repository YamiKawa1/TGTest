const Services = require('./reservation.services');
const {generalReturnMessage, internalErrorMessage} = require('../../../messages/messages');


// Ver las reservaciones las reservaciones actuales, de esta manera pueda verificar que cuartos estan disponibles en que fechas
const getReservations = async(req, res) => {
    try {
        const {state_id, id_document} = req.body

        if (state_id != undefined) { // Si se pasa la variable state, se filtraran por el estado de la reservacion en caso de ser necesario
            var foundReservations = await Services.findReservationsByState(state_id);

        } else if(id_document != undefined){ // Si se pasa la variable idDocument, se filtraran por el estado de la reservacion en caso de ser necesario 
            var foundReservations = await Services.findReservationsByIdDocument(id_document);

        } else { // En caso de no haber un filtro, se pasan todas las reservaciones
            var foundReservations = await Services.findAllReservations();

        }
    
        // Verifica que exista al menos 1 reservacion
        if (foundReservations.length == 0) return generalReturnMessage(res, 204, 'There is not reservations')

        return generalReturnMessage(res, 200, 'Reservations', foundReservations)

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'getReservations', error)
    }
    
}

// Solo se pueden eliminar reservaciones canceladas, para sacar datos innecesarios de la base de datos
const deleteReservation = async(req, res) => {
    try {
        const {id_reservation} = req.body
        const reservation = await Services.findReservationById(id_reservation);

        if (reservation.state_id != 3) return generalReturnMessage(res, 200, `Reservation ${id_reservation} has not been canceled`);

        await Services.deleteReservation(id_reservation);

        return generalReturnMessage(res, 200, `Reservation ${id_reservation} deleted permanently`);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'deleteReservation', error);
    }
}

// Hacer una reservacion, esto es la primera parte de la reservacion, 
// donde se piden todos los datos y pasa al estado pendiente
const makeReservation = async(req, res) => {
    try {
        const {
            // datos de la factura
            room_id,
            // datos de clientes
            fullname,
            id_document,
            email,
            phone,
            // datos de la reservacion 
            pay_method,
            entry_date,
            exit_date,
            people_quantity
        } = req.body;

        if(!room_id || !fullname || !id_document || !email || !phone || !pay_method || !entry_date || !exit_date || !people_quantity) {
            return generalReturnMessage(res, 400, 'Missed Data');
        }
        // verificar que el cuarto exista
        const foundRoom = await Services.findRoomById(room_id);
        if(foundRoom == undefined)  return generalReturnMessage(res, 400, `The Room ${room_id} does not exist`);

        let staying_days = getStayingDays(entry_date, exit_date)

        // No se puede hacer una reservacion en la misma habitacion que otra persona ya tiene una reservacion en el mismo tiempo
        let roomAvailable = await Services.dateRoomIsInUse(room_id, entry_date, exit_date);
        if(roomAvailable) return generalReturnMessage(res, 400, `The Room ${room_id} is already reserved`);

        // validar datos
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        if(!email.match(emailRegex)) return generalReturnMessage(res, 400, 'incorrect congifuration for Email');
        if (!phone.match(phoneRegex)) return generalReturnMessage(res, 400, 'incorrect congifuration for Phone');

        const createdBill = await Services.createNewBill(room_id, foundRoom.price);
    
        const createdClient = await Services.createNewClient(fullname, id_document, email, phone);
    
        const createdReservation = await Services.createNewReservation(createdBill.id, createdClient.id, 1, pay_method, staying_days, entry_date, exit_date, people_quantity);
            
        return generalReturnMessage(res, 201, 'Reservation Made', createdReservation);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'makeReservation', error);
    }

}

// El usuario paga la reservacion
const payReservation = async(req, res) => {
    try {
        const {id_reservation} = req.body

        const reservation = await Services.findReservationById(id_reservation)

        if (reservation == undefined) return generalReturnMessage(res, 404, `Reservation ${id_reservation} does no exist`);

        if (reservation.state_id == 2) return generalReturnMessage(res, 400, `Reservation ${id_reservation} has been paid before`);
        
        await Services.changeReservationStatus( 2, id_reservation);
        
        return generalReturnMessage(res, 200, `Reservation ${id_reservation} has been paid`);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'payReservation', error);
        
    }
    

}

// Cancelar la reservacion en caso de no ser concretado el pago en el tiempo estimado
const cancelReservation = async(req, res) => {
    try {
        const {id_reservation} = req.body

        const reservation = await Services.findReservationById(id_reservation)

        if (reservation == undefined) return generalReturnMessage(res, 404, `Reservation ${id_reservation} does no exist`);

        if (reservation.state_id == 2) return generalReturnMessage(res, 400, `Reservation ${id_reservation} has been paid, so it can not be canceled`);

        if (reservation.state_id == 3) return generalReturnMessage(res, 400, `Reservation ${id_reservation} has been already canceled`);

        await Services.changeReservationStatus(3, id_reservation);

        return generalReturnMessage(res, 200, `Reservation ${id_reservation} canceled`);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'cancelReservation', error);
        
    }
}

// Obtiene los dias de estadia dependiendo de la fecha de entrada y la fecha de salida
const getStayingDays = (entry_date, exit_date) => {
    try {
        const millisecondsToDay = 8.64e+7; // cantidad a dividir para pasar de millisegundos a dias o a multiplicar para pasar de dias a milisegundos 
        let initialDate = new Date(entry_date);
        let endDate = new Date(exit_date);
        
        let staying_days =  endDate.getTime() - initialDate.getTime();
        
        staying_days = staying_days / millisecondsToDay;
        return staying_days
    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'getStayingDays', error);
        
    }
}

module.exports = {
    getReservations,
    deleteReservation,
    makeReservation,
    payReservation,
    cancelReservation
}
