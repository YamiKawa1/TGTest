const {Rooms} = require('../rooms')
const {States} = require('../states')
const {Bills} = require('../bills')
const {Clients} = require('../clients')
const {Reservations} = require('../reservations')
const sequelize = require('../../database')

const initializeDB = async() => {
    // Sincronizar la base de datos
    await Reservations.sync({force: true});
    await Bills.sync({force: true});
    await Rooms.sync({force: true});
    await States.sync({force: true});
    await Clients.sync({force: true});
    
    
    // Crear datos de inicio 
    // Cuartos para reservar 
    createRoom(1, 1, 3, 250);
    createRoom(1, 2, 2, 150);
    createRoom(1, 3, 1, 75);

    // Estados de las reservaciones
    createState('Pendiente', 'Esperando el pago')
    createState('Pagado', 'Pagado')
    createState('Eliminado', 'Reservacion Cancelada')
}

const createRoom = (floor, door, beds, price) =>{
    Rooms.create({
        floor: floor, 
        door: door,
        beds: beds,
        price: price,
    });
}

const createState = (name, definition) =>{
    States.create({
        name: name,
        definition: definition,
    });
}

module.exports = {initializeDB}
