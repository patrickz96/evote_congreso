#!/bin/bash
psql -U postgres -d evote -c "UPDATE padron_electoral SET clave_secreta = substr(gen_random_uuid()::text,0,9)"
psql -U postgres -d evote -c "\COPY (select p.id_padron_electoral as id, e.apn, e.email, p.clave_secreta from elector e inner join padron_electoral p on e.id_elector = p.id_elector where e.estado = true) TO '~/evote_bk/padron_claves.csv' WITH CSV HEADER;"
