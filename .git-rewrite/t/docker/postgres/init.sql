# Docker configurations for PostgreSQL
CREATE DATABASE IF NOT EXISTS timonacore;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';
