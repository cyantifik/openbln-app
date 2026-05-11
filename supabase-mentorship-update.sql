-- ================================================
-- OPEN BLN: Mentorship section - Profile update
-- Run this in Supabase SQL Editor
-- ================================================

-- Add mentee flag and topic fields to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_mentee BOOLEAN DEFAULT false;
ALTER TABLE members ADD COLUMN IF NOT EXISTS mentor_topics TEXT[] DEFAULT '{}';
ALTER TABLE members ADD COLUMN IF NOT EXISTS mentee_topics TEXT[] DEFAULT '{}';
