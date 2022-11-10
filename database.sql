CREATE TABLE transactions (
		transaction_id serial primary key,
    transaction_type varchar(1),
    transaction_date date,
    transaction_value NUMERIC(11,2),
    cpf varchar(11),
    card_number varchar(12),
    transaction_time time,
    store_owner varchar(14),
    store_name varchar(19)
);