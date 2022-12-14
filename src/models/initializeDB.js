const db = require('../database')
const {internalErrorMessage} = require('../messages/messages')

const initializeDB = async() => {
    try {
        // Iniciar la base de datos
        await db.query(`
            CREATE TABLE IF NOT EXISTS "rooms"(
                id serial NOT NULL,
                floors integer NOT NULL,
                doors integer NOT NULL,
                beds integer NOT NULL,
                price double precision,
                PRIMARY KEY (id)
            );

            CREATE TABLE IF NOT EXISTS "bills"(
                id serial NOT NULL,
                room_id integer NOT NULL,
                total double precision NOT NULL,
                PRIMARY KEY (id),
                CONSTRAINT fk_bills_rooms FOREIGN KEY (room_id)
                    REFERENCES "rooms" (id) MATCH SIMPLE
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS "states"(
                id serial NOT NULL,
                name character varying(255) NOT NULL,
                PRIMARY KEY (id)
            );

            CREATE TABLE IF NOT EXISTS public."clients"(
                id serial NOT NULL,
                fullname character varying(100) NOT NULL,
                id_document character varying(100) NOT NULL,
                email character varying(60),
                phone character varying(25),
                PRIMARY KEY (id)
            );

            CREATE TABLE IF NOT EXISTS "reservations"(
                id serial NOT NULL,
                bill_id integer,
                client_id integer,
                state_id integer,
                pay_method character varying,
                staying_days integer,
                entry_date date,
                exit_date date,
                people_quantity integer,
                CONSTRAINT fk_reservations_clients FOREIGN KEY (client_id)
                    REFERENCES "clients" (id) MATCH SIMPLE
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                CONSTRAINT fk_reservations_bills FOREIGN KEY (bill_id)
                    REFERENCES "bills" (id) MATCH SIMPLE
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                CONSTRAINT fk_reservations_states FOREIGN KEY (state_id)
                    REFERENCES "states" (id) MATCH SIMPLE
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
                    
            );
        `)

        console.log('Datos extra Base de datos Creada');
        
        // Crear datos de inicio 
        // Cuartos para reservar 
        await createRoom(1, 1, 1, 75);
        await createRoom(1, 2, 2, 150);
        await createRoom(2, 3, 3, 250);
        await createRoom(2, 2, 3, 175);
        await createRoom(2, 3, 3, 250);
        await createRoom(3, 1, 2, 100);

        // Estados de las reservaciones
        await createState('Pendiente');
        await createState('Pagado');
        await createState('Eliminado');

        console.log('Datos extra creados');

    } catch (error) {
        internalErrorMessage(null, 'initalizeDB.js', 'initalizeDB',  error)
    }
    
}

const createRoom = async(floors, doors, beds, price) =>{
    await db.query(`
    INSERT INTO rooms (floors, doors, beds, price)
    VALUES (($1), ($2), ($3), ($4));
    `,[floors, doors, beds, price])
}

const createState = async(name) =>{
    await db.query(`
    INSERT INTO states (name)
    VALUES (($1));
    `, [name])
}

module.exports = {initializeDB}
