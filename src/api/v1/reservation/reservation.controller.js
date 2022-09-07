const {Reservations} = require('../../../models/reservations');
const { States } = require('../../../models/states');
const {Clients} = require('../../../models/clients');
const { Bills } = require('../../../models/bills');
const { Rooms } = require('../../../models/rooms');
const {sequelize} = require('../../../database');
const {generalReturnMessage, internalErrorMessage} = require('../../../messages/messages');



// Ver las reservaciones las reservaciones actuales, de esta manera pueda verificar que cuartos estan disponibles en que fechas
const getReservations = async(req, res) => {
    try {
        const {state, idDocument} = req.body
        console.log(state, idDocument);
        if (state != undefined) { // Si se pasa la variable state, se filtraran por el estado de la reservacion en caso de ser necesario
            var foundReservations = await Reservations.findAll({ where: {state_id: state} });
            
        } else if(idDocument != undefined){ // Si se pasa la variable idDocument, se filtraran por el estado de la reservacion en caso de ser necesario 
            var foundReservations = await Clients.findAll({include: Reservations, where: { idDocument: idDocument}});
            
        } else { // En caso de no haber un filtro, se pasan todas las reservaciones
            var foundReservations = await Reservations.findAll();
            
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
        const {idReservation} = req.body
        const reservation = await Reservations.findByPk(idReservation);

        if (reservation.state_id != 3) return generalReturnMessage(res, 200, `Reservation ${idReservation} has not been canceled`);

        const deletedReservation = await Reservations.destroy({ where: {id: idReservation} });

        return generalReturnMessage(res, 200, `Reservation ${idReservation} deleted permanently`);

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
            peopleQuantity
        } = req.body;

        if(!room_id || !total || !fullname || !idDocument || !email || !phone || !payMethod || !entryDate || !exitDate || !peopleQuantity) {
            return generalReturnMessage(res, 400, 'Missed Data');
        }
        // verificar que el exista
        const foundRoom = await Rooms.findOne({ where: { id: room_id} });
        if(foundRoom == undefined)  return generalReturnMessage(res, 400, `The Room ${room_id} does not exist`);

        // No se puede hacer una reservacion en la misma habitacion que otra persona ya tiene una reservacion en el mismo tiempo
        let roomAvailable = roomIsAvailable(room_id, entryDate, exitDate);
        // if(!roomAvailable)  generalReturnMessage(res, 400, `The Room ${room_id} is already reserved`);

        // validar datos
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if(!email.match(emailRegex)) return generalReturnMessage(res, 400, 'incorrect congifuration for Email');
        if (!phone.match(phoneRegex)) return generalReturnMessage(res, 400, 'incorrect congifuration for Phone');

        let stayingDays = getStayingDays(entryDate, exitDate)

        const createdBill = await Bills.create({
            room_id: room_id,
            total: total
        });
    
        const createdClient = await Clients.create({
            fullname: fullname,
            idDocument: idDocument,
            email: email,
            phone: phone
        });
    
        const createdReservation = await Reservations.create({
            bills_id: createdBill.id,
            clients_id: createdClient.id,
            state_id: 1,
            payMethod: payMethod,
            stayingDays: stayingDays,
            entryDate: entryDate,
            exitDate: exitDate,
            peopleQuantity: peopleQuantity,
        });


        return generalReturnMessage(res, 201, 'Reservation Made', createdReservation);
    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'makeReservation', error);
    }

}

// El usuario paga la reservacion
const payReservation = async(req, res) => {
    try {
        const {idReservation} = req.body

        const reservation = await Reservations.findByPk(idReservation)

        if (reservation == undefined) return generalReturnMessage(res, 404, `Reservation ${idReservation} does no exist`);

        if (reservation.state_id == 2) return generalReturnMessage(res, 400, `Reservation ${idReservation} has been paid before`);
        
        await Reservations.update(
            { state_id: 2 }, 
            { where: {id: idReservation} 
        });
        
        return generalReturnMessage(res, 200, `Reservation ${idReservation} has been paid`);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'payReservation', error);
        
    }
    

}

// Cancelar la reservacion en caso de no ser concretado el pago en el tiempo estimado
const cancelReservation = async(req, res) => {
    try {
        const {idReservation} = req.body

        const reservation = await Reservations.findByPk(idReservation)

        if (reservation == undefined) return generalReturnMessage(res, 404, `Reservation ${idReservation} does no exist`);

        if (reservation.state_id == 2) return generalReturnMessage(res, 400, `Reservation ${idReservation} has been paid, so it can not be canceled`);

        if (reservation.state_id == 3) return generalReturnMessage(res, 400, `Reservation ${idReservation} has been already canceled`);

        await Reservations.update(
            { state_id: 3 }, 
            { where: {id: idReservation} 
        });

        return generalReturnMessage(res, 200, `Reservation ${idReservation} canceled`);

    } catch (error) {
        return internalErrorMessage(res, 'reservation.controller.js', 'cancelReservation', error);
        
    }
}

// Obtiene los dias de estadia dependiendo de la fecha de entrada y la fecha de salida
const getStayingDays = (entryDate, exitDate) => {
    const millisecondsToDay = 8.64e+7; // cantidad a dividir para pasar de millisegundos a dias o a multiplicar para pasar de dias a milisegundos 
    let initialDate = new Date(entryDate);
    let endDate = new Date(exitDate);
    
    let stayingDays =  endDate.getTime() - initialDate.getTime();
    
    stayingDays = stayingDays / millisecondsToDay;
    return stayingDays
}

const roomIsAvailable = async (room_id, entryDate, exitDate) => {
    const reservations = await Reservations.findAll({
        include: {
            model: Bills, 
            where: { room_id: room_id } 
        }, 
        // where: {
        //     entryDate: {
        //         $lte: entryDate,
        //         $gte: exitDate,
        //         // $between: [entryDate, exitDate]
        //     },
        //     exitDate: {
        //         $lte: entryDate,
        //         $gte: exitDate,
        //         // $between: [entryDate, exitDate]

        //     }
        // }
    })
    console.log('reservations', reservations);
    return reservations.length == 0 ?  true :  false; 
}


module.exports = {
    getReservations,
    deleteReservation,
    makeReservation,
    payReservation,
    cancelReservation
}
