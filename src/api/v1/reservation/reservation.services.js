const db = require('../../../database')

const findAllReservations = async() => {
        let query = `SELECT * FROM reservations`;
        let result = await db.query(query);
        return result.rows;   
}

const findReservationsByState = async(state_id) => {
    let query = `SELECT * FROM reservations WHERE state_id = ($1)`;
    let result = await db.query(query, [state_id]);

    return result.rows;
}

const findReservationsByIdDocument = async(id_document) => {
    let query = `
    SELECT * 
    FROM reservations 
    JOIN clients ON reservations.client_id = clients.id
    WHERE clients.id_document = ($1)
    `;
    let result = await db.query(query, [id_document]);
    return result.rows;
}

const findReservationById = async(id_reservation) => {
    let query = `
    SELECT * 
    FROM reservations 
    WHERE id = ($1)
    `;
    let reservations = await db.query(query, [id_reservation]);
    return reservations.rows[0];

}

const findRoomById = async(room_id) => {
    let query = `
    SELECT * 
    FROM rooms 
    WHERE id = ($1)
    `;
    let reservations = await db.query(query, [room_id]);
    return reservations.rows[0];

}

const createNewBill = async(room_id, roomPrice) => {
    let query = `
    INSERT INTO bills (room_id, total)
    VALUES  (($1), ($2))
    RETURNING id
    `;
    let bill = await db.query(query, [room_id, roomPrice]);

    return bill.rows[0];
}

const createNewClient = async(fullname, id_document, email, phone) => {
    let query = `
    INSERT INTO clients (fullname, id_document, email, phone)
    VALUES  (($1), ($2), ($3), ($4))
    RETURNING id
    `;
    let result = await db.query(query, [fullname, id_document, email, phone]);
    return result.rows[0];
}

const createNewReservation = async(bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity) => {
    let query = `
    INSERT INTO reservations (bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity)
    VALUES  (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))
    RETURNING *
    `;
    let result = await db.query(query, [bill_id, client_id, state_id, pay_method, staying_days, entry_date, exit_date, people_quantity]);
    return result.rows;
}

const deleteReservation = async(id_reservation) => {
    let query = `
    DELETE 
    FROM reservations 
    WHERE id = ($1)
    `;
    let reservations = await db.query(query, [id_reservation]);
    return reservations.rows[0];
}

const changeReservationStatus = async(status_id, id_reservation) => {
    let query = `
    UPDATE reservations
    SET state_id = ($1)
    WHERE id = ($2)
    `;
    let result = await db.query(query, [status_id, id_reservation]);
    return result.rows[0];
}

const dateRoomIsInUse = async(room_id, entry_date, exit_date)=>{
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