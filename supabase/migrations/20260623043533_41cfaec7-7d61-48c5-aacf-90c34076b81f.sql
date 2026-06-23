
-- Create a private schema not exposed by PostgREST
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 1) has_role: switch to SECURITY INVOKER.
-- Safe because the existing "Users can view their own roles" policy lets the
-- caller read their own user_roles row, which is what has_role(auth.uid(), ...) checks.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2) Move claim_first_admin out of public into private, expose a thin INVOKER wrapper.
DROP FUNCTION IF EXISTS public.claim_first_admin();

CREATE OR REPLACE FUNCTION private.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'An admin already exists. Ask an existing admin to grant you access.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION private.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private
AS $$
  SELECT private.claim_first_admin();
$$;

-- 3) Move list_users_with_roles out of public into private with INVOKER wrapper.
DROP FUNCTION IF EXISTS public.list_users_with_roles();

CREATE OR REPLACE FUNCTION private.list_users_with_roles()
RETURNS TABLE(user_id uuid, email text, created_at timestamptz, roles app_role[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT u.id, u.email::text, u.created_at,
    COALESCE(ARRAY_AGG(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[])
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  GROUP BY u.id, u.email, u.created_at
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION private.list_users_with_roles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.list_users_with_roles() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_users_with_roles()
RETURNS TABLE(user_id uuid, email text, created_at timestamptz, roles app_role[])
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, private
AS $$
  SELECT * FROM private.list_users_with_roles();
$$;
