CREATE TABLE public."Clients"
(
    id serial NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(60),
    phone character varying(25),
    PRIMARY KEY (id)
);