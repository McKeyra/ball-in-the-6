# Supabase SQL Archive

This directory contains the original Supabase-specific SQL files that were used during development.

## Files

- `supabase-schema.sql` - Original schema with Supabase-specific features
- `supabase-setup-public.sql` - Complete public schema setup with RLS policies
- `supabase-roles.sql` - User roles and permissions setup
- `supabase-security-fixes.sql` - Security policy fixes for RLS
- `supabase-missing-tables.sql` - Additional tables added during development
- `supabase-migration-osba.sql` - OSBA data migration
- `seed_data.sql` - Sample data for testing

## Migration to Digital Ocean PostgreSQL

For Digital Ocean PostgreSQL deployment, use the main file instead:
- `../digital-ocean-postgres-setup.sql` - Complete schema optimized for standard PostgreSQL

## Note

These files are kept for reference and historical purposes. They include Supabase-specific features like:
- Row Level Security (RLS) policies
- Supabase Auth integration
- Supabase-specific functions

If migrating away from Supabase, you'll also need to update the application code to use a different database client and authentication system.
