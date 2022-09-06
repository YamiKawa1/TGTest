const {Rooms} = require('./rooms')
const {States} = require('./states')

const initializeDB = () => {
    Rooms.build({
        floor: 1, 
        door: 1,
        beds: 3,
        price: 250,
    });

    Rooms.build({
        floor: 1, 
        door: 2,
        beds: 2,
        price: 150,
    });

    Rooms.build({
        floor: 1, 
        door: 3,
        beds: 1,
        price: 75,
    });

    States.build({
        name: 'Pendiente',
        definition: 'Esperando el pago'
    });

    States.build({
        name: 'Pagado',
        definition: 'Pagado'
    });

    States.build({
        name: 'Eliminado',
        definition: 'Reserva Cancelada'
    });
}

module.exports = initializeDB
