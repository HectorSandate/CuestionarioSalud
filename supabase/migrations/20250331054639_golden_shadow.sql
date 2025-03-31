/*
  # Initial Schema Setup for NOM-035 Assessment System

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
    - `assessments`
      - Stores assessment responses
      - Links to profiles
    - `assessment_results`
      - Stores calculated results and recommendations
      - Links to assessments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  company_role text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  assessment_type text NOT NULL,
  responses jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_assessment_type CHECK (assessment_type IN ('traumatic_events', 'risk_factors', 'organizational'))
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  risk_level text NOT NULL,
  score integer NOT NULL,
  recommendations text[],
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_risk_level CHECK (risk_level IN ('low', 'medium', 'high'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Assessment results policies
CREATE POLICY "Users can read own results"
  ON assessment_results FOR SELECT
  TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();