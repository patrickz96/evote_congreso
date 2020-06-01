#!/bin/bash
psql -U postgres -d evote -c "UPDATE padron_electoral SET clave_secreta = substr(gen_random_uuid()::text,0,9)"
