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


