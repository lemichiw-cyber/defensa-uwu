-- ============================================================
-- LIMPIEZA COMPLETA — Ejecutar esto PRIMERO
-- ============================================================

-- Desactivar RLS temporalmente para poder borrar
do $$
declare
  r record;
begin
  for r in (select tablename from pg_tables where schemaname = 'public') loop
    execute 'drop table if exists public.' || quote_ident(r.tablename) || ' cascade';
  end loop;
end $$;

-- Verificar que no queden tablas
-- select tablename from pg_tables where schemaname = 'public';
