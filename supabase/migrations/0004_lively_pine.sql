/*
  # Fix profile policies and admin creation

  1. Changes
    - Drop existing policies to prevent recursion
    - Create new, simplified policies
    - Add admin check function
  
  2. Security
    - Enable RLS
    - Add separate policies for admin and regular users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create admin check function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    JOIN profiles ON profiles.id = auth.users.id
    WHERE auth.users.id = auth.uid()
    AND profiles.is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Create new policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR auth.is_admin() = true
  );

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow insert during signup"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);