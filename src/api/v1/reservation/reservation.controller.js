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

const deleteReservation = async(req, res) => {
    try {
        const {idReservation} = req.body
        const deletedReservation = await Reservations.destroy({ where: {id: idReservation} });

        generalReturnMessage(res, 200, `Reservation ${idReservation} deleted permanently`);

    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'deleteReservation', error);
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
            generalReturnMessage(res, 400, 'Missed Data');
        }
        // verificar que el exista
        const foundRoom = Rooms.findOne({ where: { id: room_id} });
        console.log(foundRoom);
        if(foundRoom == undefined)  generalReturnMessage(res, 400, `The Room ${room_id} does not exist`);

        // No se puede hacer una reservacion en la misma habitacion que otra persona ya tiene una reservacion en el mismo tiempo
        // let roomIsAvailable = roomIsAvailable(room_id, entryDate, exitDate);
        // if(!roomIsAvailable)  generalReturnMessage(res, 400, `The Room ${room_id} is already reserved`);

        // validar datos
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if(!email.match(emailRegex)) generalReturnMessage(res, 400, 'incorrect congifuration for Email');
        if (!phone.match(phoneRegex)) generalReturnMessage(res, 400, 'incorrect congifuration for Phone');

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
        })
        

        generalReturnMessage(res, 201, 'Reservation Made', createdReservation);
    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'makeReservation', error);
    }

}

// El usuario paga la reservacion
const payReservation = async(req, res) => {
    try {
        const {idReservation} = req.body
        Reservations.update(
            { state: 2 }, 
            { where: {id: idReservation} 
        });
        // TODO alerta en caso de que no exista la reservacion a cancelar

        generalReturnMessage(res, 200, `Reservation ${idReservation} Payed`);

    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'payReservation', error);
        
    }
    

}

// Cancelar la reservacion en caso de no ser concretado el pago en el tiempo estimado
const cancelReservation = async(req, res) => {
    try {
        const {idReservation} = req.body
        await Reservations.update(
            { state: 3 }, 
            { where: {id: idReservation} 
        });
        // TODO alerta en caso de que no exista la reservacion a cancelar
        generalReturnMessage(res, 200, `Reservation ${idReservation} canceled`);

    } catch (error) {
        internalErrorMessage(res, 'reservation.controller.js', 'cancelReservation', error);
        
    }
}

const getStayingDays = (entryDate, exitDate) => {
    const millisecondsToDay = 8.64e+7; // cantidad a dividir para pasar de millisegundos a dias o a multiplicar para pasar de dias a milisegundos 
    let initialDate = new Date(entryDate);
    let endDate = new Date(exitDate);
    
    let stayingDays =  endDate.getTime() - initialDate.getTime();
    
    stayingDays = stayingDays / millisecondsToDay;
    return stayingDays
}

const roomIsAvailable = async (room_id, entryDate, exitDate) => {
    const reservations = await sequelize.query(`
    SELECT entryDate, exitDate
    FROM Reservations
    INNER JOIN Bills on Reservations.room_id = Bills.room_id
    WHERE Bills.room_id = ($1)
    WHERE Reservations.entryDate > ($2) < Reservations.exitDate
    OR Reservations.entryDate > ($3) < Reservations.exitDate
    `, [room_id, entryDate, exitDate])
    // const reservations = await Reservations.findAll({
    //     include: {
    //         model: Bills, 
    //         where: { room_id: room } 
    //     }, 
    //     where: {
    //         entryDate: {
    //             $lte: entryDate,
    //             $gte: exitDate,
    //             // $between: [entryDate, exitDate]
    //         },
    //         exitDate: {
    //             $lte: entryDate,
    //             $gte: exitDate,
    //             // $between: [entryDate, exitDate]

    //         }
    //     } 
    // })

    return reservations.length == 0 ?  true :  false;

    
}

module.exports = {
    getReservations,
    deleteReservation,
    makeReservation,
    payReservation,
    cancelReservation
}
