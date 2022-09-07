CREATE TABLE public."Bills"
(
    id serial NOT NULL,
    room_id integer NOT NULL,
    total double precision NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_bills_rooms FOREIGN KEY (room_id)
        REFERENCES public."Rooms" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);