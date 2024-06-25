#!/bin/bash

# Подключение к базе данных и вывод списка таблиц
tables=$(psql -U spmsuser -d spms -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';")

# Для каждой таблицы выводим её структуру
for table in $tables; do
    echo "Structure of table: $table"
    psql -U spmsuser -d spms -c "\d $table"
done

