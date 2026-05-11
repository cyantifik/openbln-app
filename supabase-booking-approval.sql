-- Add 'pending' and 'declined' to bookings status check
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled', 'completed'));

-- Set default status to pending
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'pending';
