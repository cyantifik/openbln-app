-- ================================================
-- OPEN BLN: Mentor Booking Feature - Database Setup
-- Run this in Supabase SQL Editor
-- ================================================

-- 1. Add is_mentor flag to existing members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;

-- 2. Create mentor_profiles table (calendar connection + settings)
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  auth_id UUID NOT NULL,
  google_refresh_token TEXT,
  google_calendar_id TEXT DEFAULT 'primary',
  session_duration INTEGER DEFAULT 30, -- minutes
  session_title TEXT DEFAULT '1:1 Mentoring Session',
  timezone TEXT DEFAULT 'Europe/Berlin',
  is_calendar_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(member_id),
  UNIQUE(auth_id)
);

-- 3. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  mentor_auth_id UUID NOT NULL,
  mentee_auth_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  google_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS Policies

-- Enable RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Mentor profiles: anyone can read connected mentors, only the mentor can update their own
CREATE POLICY "Anyone can view mentor profiles"
  ON mentor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Mentors can update their own profile"
  ON mentor_profiles FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Mentors can insert their own profile"
  ON mentor_profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

-- Bookings: participants can view their own, authenticated users can create
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = mentor_auth_id OR auth.uid() = mentee_auth_id);

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = mentee_auth_id);

CREATE POLICY "Participants can update their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = mentor_auth_id OR auth.uid() = mentee_auth_id);

-- Allow reading is_mentor flag from members (should already be readable)
-- Just make sure members SELECT policy exists

-- 5. Index for fast booking lookups
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON bookings(mentor_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_mentee ON bookings(mentee_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
