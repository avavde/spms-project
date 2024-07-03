#!/bin/bash


DB_NAME="spms"
DB_USER="spmsuser"
DB_HOST="localhost"
DB_PORT="5432"
OUTPUT_DIR="./db_info"

mkdir -p $OUTPUT_DIR

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" > $OUTPUT_DIR/db_size.txt

# Получение структуры всех таблиц
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    table_schema, 
    table_name, 
    column_name, 
    data_type, 
    character_maximum_length 
FROM 
    information_schema.columns 
WHERE 
    table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY 
    table_schema, 
    table_name, 
    ordinal_position;
" > $OUTPUT_DIR/tables_structure.txt

# Получение всех внешних ключей
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    conname AS constraint_name, 
    conrelid::regclass AS table_from, 
    a.attname AS column_from, 
    confrelid::regclass AS table_to, 
    af.attname AS column_to 
FROM 
    pg_constraint AS c 
JOIN 
    lateral unnest(c.conkey) WITH ORDINALITY AS a(attnum, attposition) 
    ON a.attnum = any(c.conkey) 
JOIN 
    pg_attribute AS a 
    ON a.attnum = any(c.conkey) AND a.attrelid = c.conrelid 
JOIN 
    lateral unnest(c.confkey) WITH ORDINALITY AS af(attnum, attposition) 
    ON af.attposition = a.attposition 
JOIN 
    pg_attribute AS af 
    ON af.attnum = any(c.confkey) AND af.attrelid = c.confrelid 
WHERE 
    c.contype = 'f';
" > $OUTPUT_DIR/foreign_keys.txt

echo "Информация о базе данных сохранена в директорию $OUTPUT_DIR"
