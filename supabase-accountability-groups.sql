-- Accountability Groups tables
-- Run this in Supabase SQL Editor

-- 1. Create the groups table
CREATE TABLE IF NOT EXISTS accountability_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 2. Insert the five groups
INSERT INTO accountability_groups (id, name, description, sort_order) VALUES
  ('career-mentorship', 'Career and Mentorship', 'Figuring out my next move and who can help.', 1),
  ('collab-connection', 'Collab and Connection', 'Finding my creative circle and people who get it.', 2),
  ('building-something', 'Building Something', 'I have an idea, let''s brainstorm.', 3),
  ('skills-craft', 'Skills and Craft', 'I want to learn, swap knowledge, and grow.', 4),
  ('at-a-crossroads', 'At a Crossroads', 'Figuring out what''s next, together.', 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Create junction table for member-group relationships
CREATE TABLE IF NOT EXISTS member_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  group_id TEXT NOT NULL REFERENCES accountability_groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, group_id)
);

-- 4. Enable RLS
ALTER TABLE accountability_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_groups ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for accountability_groups (everyone can read)
CREATE POLICY "Anyone can view groups"
ON accountability_groups FOR SELECT
TO authenticated
USING (true);

-- 6. RLS Policies for member_groups
CREATE POLICY "Anyone can view member groups"
ON member_groups FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Members can join groups"
ON member_groups FOR INSERT
TO authenticated
WITH CHECK (
  member_id IN (SELECT id FROM members WHERE auth_id = auth.uid())
);

CREATE POLICY "Members can leave groups"
ON member_groups FOR DELETE
TO authenticated
USING (
  member_id IN (SELECT id FROM members WHERE auth_id = auth.uid())
);

-- 7. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_member_groups_member ON member_groups(member_id);
CREATE INDEX IF NOT EXISTS idx_member_groups_group ON member_groups(group_id);
