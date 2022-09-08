CREATE TABLE "rooms"(
        id serial NOT NULL,
        floors integer NOT NULL,
        doors integer NOT NULL,
        beds integer NOT NULL,
        price double precision,
        PRIMARY KEY (id)
    );