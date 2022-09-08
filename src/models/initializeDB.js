const db = require('../database')

const initializeDB = async() => {
    // Iniciar la base de datos
    await db.query(`
    CREATE TABLE "rooms"(
        id serial NOT NULL,
        floors integer NOT NULL,
        doors integer NOT NULL,
        beds integer NOT NULL,
        price double precision,
        PRIMARY KEY (id)
    );

    CREATE TABLE "bills"(
        id serial NOT NULL,
        room_id integer NOT NULL,
        total double precision NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_bills_rooms FOREIGN KEY (room_id)
            REFERENCES "rooms" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
    );

    CREATE TABLE "states"(
        id serial NOT NULL,
        name character varying(255) NOT NULL,
        PRIMARY KEY (id)
    );

    CREATE TABLE public."clients"(
        id serial NOT NULL,
        fullname character varying(100) NOT NULL,
        id_document character varying(100) NOT NULL,
        email character varying(60),
        phone character varying(25),
        PRIMARY KEY (id)
    );

    CREATE TABLE "reservations"(
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
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
        CONSTRAINT fk_reservations_bills FOREIGN KEY (bill_id)
            REFERENCES "bills" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
        CONSTRAINT fk_reservations_states FOREIGN KEY (state_id)
            REFERENCES "states" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
    );
`)
    
    
    // Crear datos de inicio 
    // Cuartos para reservar 
    await createRoom(1, 1, 3, 250);
    await createRoom(1, 2, 2, 150);
    await createRoom(1, 3, 1, 75);

    // Estados de las reservaciones
    await createState('Pendiente');
    await createState('Pagado');
    await createState('Eliminado');
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
