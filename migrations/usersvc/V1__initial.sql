CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    firstname text COLLATE pg_catalog."default",
    lastname text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

