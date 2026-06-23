
-- Server-side enforcement of bookings.total_price
CREATE OR REPLACE FUNCTION public.enforce_booking_total_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  ppn numeric;
  nights integer;
BEGIN
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'check_out must be after check_in';
  END IF;

  SELECT price_per_night INTO ppn FROM public.rooms WHERE id = NEW.room_id;
  IF ppn IS NULL THEN
    RAISE EXCEPTION 'Invalid room_id';
  END IF;

  nights := GREATEST(1, (NEW.check_out - NEW.check_in));
  NEW.total_price := ppn * nights;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_enforce_total_price ON public.bookings;
CREATE TRIGGER bookings_enforce_total_price
BEFORE INSERT OR UPDATE OF room_id, check_in, check_out, total_price ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_total_price();
