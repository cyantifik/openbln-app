-- ===================================================================
-- OPEN BLN Supabase Schema Setup
-- ===================================================================
-- This migration creates all necessary tables, RLS policies, and seeds
-- initial data for the OPEN BLN community platform.
-- ===================================================================

-- ===================================================================
-- 0. CLEAN SLATE — Drop everything from previous attempts
-- ===================================================================
DROP TABLE IF EXISTS event_attendance CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- ===================================================================
-- 1. MEMBERS TABLE
-- ===================================================================
-- Stores information about community members
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users (id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills_offered TEXT[] DEFAULT '{}',
  skills_needed TEXT[] DEFAULT '{}',
  is_admin BOOLEAN DEFAULT false,
  achievements TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '{}',
  status TEXT DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on auth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_auth_id ON members(auth_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- ===================================================================
-- 2. EVENTS TABLE
-- ===================================================================
-- Stores information about community events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  location TEXT,
  attendance_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on date for easier querying
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- ===================================================================
-- 3. EVENT_ATTENDANCE TABLE
-- ===================================================================
-- Tracks which members attended which events (join table)
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member_id ON event_attendance(member_id);

-- ===================================================================
-- 4. APPLICATIONS TABLE
-- ===================================================================
-- Stores vetting applications from new members
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  working_on TEXT, -- Vetting Question 1
  can_help_with TEXT, -- Vetting Question 2
  how_heard TEXT, -- Vetting Question 3
  attended_before TEXT, -- Vetting Question 4
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_auth_id ON applications(auth_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON applications(reviewed_by);

-- ===================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- MEMBERS RLS Policies
-- ===================================================================
-- Anyone can view approved members
CREATE POLICY "Anyone can view approved members"
  ON members
  FOR SELECT
  USING (status = 'approved');

-- Authenticated users can view their own member record (including pending/rejected)
CREATE POLICY "Users can view their own member record"
  ON members
  FOR SELECT
  USING (auth_id = auth.uid());

-- Authenticated users can update their own member record
CREATE POLICY "Users can update their own member record"
  ON members
  FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Admins can view all members (including pending/rejected)
CREATE POLICY "Admins can view all members"
  ON members
  FOR SELECT
  USING (
    auth_id IN (
      SELECT auth_id FROM members WHERE is_admin = true AND auth_id = auth.uid()
    )
  );

-- ===================================================================
-- EVENTS RLS Policies
-- ===================================================================
-- Anyone can view events
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  USING (true);

-- ===================================================================
-- EVENT_ATTENDANCE RLS Policies
-- ===================================================================
-- Anyone can view event attendance records
CREATE POLICY "Anyone can view event attendance"
  ON event_attendance
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own attendance
CREATE POLICY "Authenticated users can insert their own attendance"
  ON event_attendance
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE members.auth_id = auth.uid()
    )
  );

-- ===================================================================
-- APPLICATIONS RLS Policies
-- ===================================================================
-- Authenticated users can insert their own applications
CREATE POLICY "Authenticated users can insert their own applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth_id = auth.uid());

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  USING (auth_id = auth.uid());

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON applications
  FOR SELECT
  USING (
    auth_id IN (
      SELECT auth_id FROM members WHERE is_admin = true AND auth_id = auth.uid()
    )
  );

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON applications
  FOR UPDATE
  USING (
    auth_id IN (
      SELECT auth_id FROM members WHERE is_admin = true AND auth_id = auth.uid()
    )
  )
  WITH CHECK (
    auth_id IN (
      SELECT auth_id FROM members WHERE is_admin = true AND auth_id = auth.uid()
    )
  );

-- ===================================================================
-- 6. SEED DATA - MEMBERS
-- ===================================================================
-- Insert 16 founding and core community members

INSERT INTO members (name, role, company, bio, skills_offered, skills_needed, is_admin, achievements, links, status, created_at)
VALUES
  (
    'Vicky Heinlein',
    'Co-Founder',
    'OPEN BLN',
    'Community builder and design strategist passionate about connecting creative professionals in Berlin.',
    ARRAY['Mentorship', 'Community Building', 'Event Design', 'Brand Strategy', 'Design Leadership', 'Creative Direction', 'Job Search Strategy', 'Design Thinking', 'Career Navigation', 'Portfolio Review', 'Personal Branding', 'Workshop Design'],
    ARRAY['Product Management', 'Business Development'],
    true,
    ARRAY['Founding Team', 'Founding Member', 'First Step', 'Networker'],
    '{"linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Habib Rahal',
    'Head of Product Design',
    'Konvo',
    'Product designer focused on creating intuitive user experiences.',
    ARRAY['Product Design', 'Framer', 'Design Systems', 'User Research'],
    ARRAY['Engineering', 'Business Strategy'],
    true,
    ARRAY['Founding Team', 'Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Lena Müller',
    'Product Designer',
    'Kreativ Studio',
    'Experienced product designer creating user-centered digital solutions.',
    ARRAY['Product Design', 'Figma', 'User Research', 'Prototyping'],
    ARRAY['Frontend Development', 'Marketing'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Marco Rossi',
    'Backend Engineer',
    'DataFlow GmbH',
    'Full-stack engineer specializing in scalable backend systems.',
    ARRAY['Backend Development', 'Node.js', 'Database Design', 'API Architecture'],
    ARRAY['Frontend Development', 'DevOps'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Sofia Petrov',
    'UX Researcher',
    'NeuroLab',
    'User experience researcher focused on understanding human behavior.',
    ARRAY['User Research', 'UX Strategy', 'Data Analysis', 'Usability Testing'],
    ARRAY['Product Management', 'Design'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Jonas Weber',
    'Founder',
    'GreenByte',
    'Serial entrepreneur and mentor focused on sustainable tech startups.',
    ARRAY['Entrepreneurship', 'Mentorship', 'Strategy', 'Fundraising'],
    ARRAY['Product Design', 'Marketing'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Aisha Khan',
    'Data Scientist',
    'Analytiq',
    'Data scientist transforming insights into actionable business strategies.',
    ARRAY['Data Science', 'Python', 'Machine Learning', 'Data Visualization'],
    ARRAY['Product Management', 'Business Strategy'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Tomás Silva',
    'Illustrator',
    'Freelance',
    'Creative illustrator and visual storyteller specializing in brand design.',
    ARRAY['Illustration', 'Visual Design', 'Branding', 'Art Direction'],
    ARRAY['Marketing', 'Digital Strategy'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Emi Tanaka',
    'DevOps Engineer',
    'CloudKraft',
    'Infrastructure specialist focused on scalable cloud solutions.',
    ARRAY['DevOps', 'Kubernetes', 'Cloud Architecture', 'CI/CD'],
    ARRAY['Backend Development', 'Security'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Felix Braun',
    'Copywriter',
    'Wortwerk',
    'Strategic copywriter crafting compelling brand narratives and messaging.',
    ARRAY['Copywriting', 'Content Strategy', 'Brand Messaging', 'Storytelling'],
    ARRAY['Design', 'Marketing'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Clara Dupont',
    'Frontend Developer',
    'PixelShift',
    'Frontend developer passionate about creating performant and beautiful web interfaces.',
    ARRAY['Frontend Development', 'React', 'CSS', 'JavaScript'],
    ARRAY['Backend Development', 'UX Design'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Nikolai Orlov',
    'Photographer',
    'Freelance',
    'Professional photographer capturing moments for brands and creative projects.',
    ARRAY['Photography', 'Visual Storytelling', 'Post-production', 'Art Direction'],
    ARRAY['Marketing', 'Design'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Priya Sharma',
    'Product Manager',
    'LaunchPad',
    'Product manager focused on building user-centric products and scaling teams.',
    ARRAY['Product Management', 'Strategy', 'Analytics', 'Team Leadership'],
    ARRAY['Design', 'Engineering'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Kai Zimmermann',
    'Sound Designer',
    'AudioSphere',
    'Sound designer and audio strategist creating immersive sonic experiences.',
    ARRAY['Sound Design', 'Audio Production', 'Music Composition', 'Audio Branding'],
    ARRAY['Video Production', 'Marketing'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Yuki Abe',
    'Strategist',
    'BrandForge',
    'Brand strategist helping companies define and communicate their unique value.',
    ARRAY['Brand Strategy', 'Marketing', 'Positioning', 'Communication Strategy'],
    ARRAY['Design', 'Product Management'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  ),
  (
    'Omar Bensaïd',
    'Mobile Developer',
    'AppWerk',
    'Mobile developer specializing in iOS and cross-platform application development.',
    ARRAY['Mobile Development', 'Swift', 'React Native', 'App Architecture'],
    ARRAY['Backend Development', 'Design'],
    false,
    ARRAY['Founding Member'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    'approved',
    now() - INTERVAL '6 months'
  );

-- ===================================================================
-- 7. SEED DATA - EVENTS
-- ===================================================================
-- Insert initial events

INSERT INTO events (title, date, description, location, attendance_count, created_at)
VALUES
  (
    'OPEN BLN #002: Shape & Align',
    '2026-03-10',
    'Exploring design systems and alignment in creative work.',
    'Berlin, Germany',
    2,
    now() - INTERVAL '3 weeks'
  ),
  (
    'Data Drinks',
    '2026-02-13',
    'Casual meetup for data professionals.',
    'Berlin, Germany',
    0,
    now() - INTERVAL '7 weeks'
  ),
  (
    'Hack & Tell #12',
    '2026-01-31',
    'Community showcase of projects and ideas.',
    'Berlin, Germany',
    0,
    now() - INTERVAL '10 weeks'
  ),
  (
    'Berlin Creative Meetup',
    '2026-01-06',
    'Monthly gathering of Berlin''s creative community.',
    'Berlin, Germany',
    0,
    now() - INTERVAL '13 weeks'
  );

-- ===================================================================
-- 8. SEED DATA - EVENT ATTENDANCE
-- ===================================================================
-- Add attendance records for the OPEN BLN #002 event
-- This event had 2 attendees (Vicky Heinlein and Habib Rahal, the founders)

INSERT INTO event_attendance (event_id, member_id, created_at)
SELECT
  e.id,
  m.id,
  now() - INTERVAL '3 weeks'
FROM events e, members m
WHERE e.title = 'OPEN BLN #002: Shape & Align'
  AND m.name IN ('Vicky Heinlein', 'Habib Rahal');

-- ===================================================================
-- END OF MIGRATION
-- ===================================================================
-- All tables, indexes, RLS policies, and seed data have been created.
-- The database is now ready for the OPEN BLN community platform.
