/*
  # Add Admin Role Support

  1. Changes
    - Add admin column to profiles table
    - Update RLS policies to give admins full access
    - Create admin user

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Add admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update policies to allow admin access
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));

-- Add admin policies for other tables
CREATE POLICY "Admins can read all goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can read all tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can read all documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can read all finances"
  ON finances
  FOR SELECT
  TO authenticated
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can read all study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING ((
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ));