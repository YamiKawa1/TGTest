CREATE TABLE public."clients"(
        id serial NOT NULL,
        fullname character varying(100) NOT NULL,
        id_document character varying(100) NOT NULL,
        email character varying(60),
        phone character varying(25),
        PRIMARY KEY (id)
    );