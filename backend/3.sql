DO $$ DECLARE
    r RECORD;
BEGIN
    -- Удаление всех таблиц
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'sql_%') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

