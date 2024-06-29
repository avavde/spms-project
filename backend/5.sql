REVOKE CONNECT ON DATABASE spms FROM public;
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'spms';

DROP DATABASE spms;
CREATE DATABASE spms;
CREATE USER spmsuser WITH ENCRYPTED PASSWORD 'spmspass';
GRANT ALL PRIVILEGES ON DATABASE spms TO spmsuser;
