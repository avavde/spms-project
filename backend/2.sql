DO $$ DECLARE
    r RECORD;
BEGIN
    -- Отключение ограничений внешнего ключа
    EXECUTE 'ALTER TABLE "public"."DeviceEvents" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."DeviceSelfTests" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."DeviceStatuses" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."DeviceZonePositions" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."Departments" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."EmployeeZones" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."Employees" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."GNSSPositions" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."Movements" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."Users" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."UserActions" DISABLE TRIGGER ALL';
    EXECUTE 'ALTER TABLE "public"."Zones" DISABLE TRIGGER ALL';

    -- Удаление всех таблиц
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

