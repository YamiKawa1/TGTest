const db = require('../../../database')
const {internalErrorMessage} = require('../../../messages/messages')

const findAllReservations = async() => {
    try {
        let query = `SELECT * FROM reservations`;
        let reservations = await db.query(query);

        return reservations.rows;   
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'findAllReservations', error)
    }
        
}

const findReservationsByState = async(state_id) => {
    try {
        let query = `SELECT * FROM reservations WHERE state_id = ($1)`;
        let reservations = await db.query(query, [state_id]);
    
        return reservations.rows;  
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'findReservationsByState', error)
    }
    
}

const findReservationsByIdDocument = async(id_document) => {
    try {
        let query = `
            SELECT * 
            FROM reservations 
            JOIN clients ON reservations.client_id = clients.id
            WHERE clients.id_document = ($1)
        `;
        let reservations = await db.query(query, [id_document]);

        return reservations.rows;
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'findReservationsByIdDocument', error)
    } 
}

const findReservationById = async(id_reservation) => {
    try {
        let query = `
            SELECT * 
            FROM reservations 
            WHERE id = ($1)
        `;
        let reservation = await db.query(query, [id_reservation]);

        return reservation.rows[0];
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'findReservationById', error)
    }
    
}

const findRoomById = async(room_id) => {
    try {
        let query = `
            SELECT * 
            FROM rooms 
            WHERE id = ($1)
        `;
        let room = await db.query(query, [room_id]);

        return room.rows[0];  
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'findRoomById', error)
    }
    
}

const createNewBill = async(room_id, roomPrice) => {
    try {
        let query = `
            INSERT INTO bills (room_id, total)
            VALUES  (($1), ($2))
            RETURNING id
        `;
        let newBill = await db.query(query, [room_id, roomPrice]);

        return newBill.rows[0];
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'createNewBill', error)
    }
    
}

const createNewClient = async(fullname, id_document, email, phone) => {
    try {
        let query = `
            INSERT INTO clients (fullname, id_document, email, phone)
            VALUES  (($1), ($2), ($3), ($4))
            RETURNING id
        `;
        let newClient = await db.query(query, [fullname, id_document, email, phone]);
        return newClient.rows[0];  
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'createNewClient', error)
    }
    
}

const createNewReservation = async(bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity) => {
    try {
        let query = `
            INSERT INTO reservations (bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity)
            VALUES  (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))
            RETURNING *
        `;
        let newReservation = await db.query(query, [bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity]);

        return newReservation.rows;        
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'createNewReservation', error)
    }

}

const deleteReservation = async(id_reservation) => {
    try {
        let query = `
            DELETE 
            FROM reservations 
            WHERE id = ($1)
        `;
        await db.query(query, [id_reservation]);        
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'deleteReservation', error)
    }
 
}

const changeReservationStatus = async(status_id, id_reservation) => {
    try {
        let query = `
            UPDATE reservations
            SET state_id = ($1)
            WHERE id = ($2)
        `;
        await db.query(query, [status_id, id_reservation]);  
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'changeReservationStatus', error)
    }
    
}

const dateRoomIsInUse = async(room_id, entry_date, exit_date)=>{
    try {
        let query = `
            SELECT entry_date, exit_date
            FROM reservations
            JOIN bills ON reservations.bill_id = bills.id
            WHERE bills.room_id = ($1)
            AND entry_date BETWEEN ($2) AND ($3)
            OR exit_date BETWEEN ($2) AND ($3)
        `;
        let result = await db.query(query, [room_id, entry_date, exit_date]);
        
        return result.rows.length > 0 ? true : false; 
    } catch (error) {
        internalErrorMessage(null, 'reservation.services', 'dateRoomIsInUse', error)
    }
    
}


module.exports = {
    findAllReservations,
    findReservationsByState,
    findReservationsByIdDocument,
    findReservationById,
    findRoomById,
    createNewBill,
    createNewClient,
    createNewReservation,
    deleteReservation,
    changeReservationStatus,
    dateRoomIsInUse
}