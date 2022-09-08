CREATE TABLE "bills"(
        id serial NOT NULL,
        room_id integer NOT NULL,
        total double precision NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_bills_rooms FOREIGN KEY (room_id)
            REFERENCES "rooms" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );