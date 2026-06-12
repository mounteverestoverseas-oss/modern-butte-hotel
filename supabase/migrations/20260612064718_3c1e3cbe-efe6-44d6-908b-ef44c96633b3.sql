
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night NUMERIC(10,2) NOT NULL,
  max_guests INT NOT NULL DEFAULT 2,
  image_url TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rooms are viewable by everyone" ON public.rooms FOR SELECT USING (true);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT WITH CHECK (
  char_length(guest_name) BETWEEN 1 AND 100
  AND char_length(guest_email) BETWEEN 3 AND 255
  AND char_length(guest_phone) BETWEEN 3 AND 30
  AND check_out > check_in
  AND guests BETWEEN 1 AND 10
  AND total_price >= 0
);

INSERT INTO public.rooms (slug, name, description, price_per_night, max_guests, amenities) VALUES
('standard', 'Standard Room', 'Cozy room with traditional Newari decor, perfect for solo travelers or couples.', 60, 2, ARRAY['Free WiFi','Private Bathroom','Mountain View','Breakfast']),
('deluxe', 'Deluxe Room', 'Spacious room featuring handcrafted woodwork, premium bedding and a sitting area.', 80, 3, ARRAY['Free WiFi','Private Bathroom','City View','Breakfast','Mini Bar']),
('suite', 'Heritage Suite', 'Our finest suite — a serene retreat with separate living space and panoramic views.', 120, 4, ARRAY['Free WiFi','Private Bathroom','Panoramic View','Breakfast','Mini Bar','Lounge Area']);
