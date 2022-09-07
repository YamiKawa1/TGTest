CREATE TABLE public."Reservations"
(
    id serial NOT NULL,
    bills_id integer,
    clients_id integer,
    state_id integer,
    "payMethod" character varying,
    "stayingDays" integer,
    "entryDate" date,
    "exitDate" date,
    "peopleQuantity" integer,
    CONSTRAINT fk_reservations_clients FOREIGN KEY (clients_id)
        REFERENCES public."Clients" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_reservations_bills FOREIGN KEY (bills_id)
        REFERENCES public."Bills" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_reservations_states FOREIGN KEY (state_id)
        REFERENCES public."States" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);


