/*
  # CRM Application Database Schema

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `status` (text) - new, contacted, qualified, lost
      - `source` (text) - website, referral, social, email
      - `assigned_to` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `address` (text)
      - `industry` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `value` (numeric)
      - `customer_id` (uuid, foreign key)
      - `status` (text) - new, contacted, qualified, proposal, negotiation, won, lost
      - `assigned_to` (text)
      - `probability` (integer)
      - `expected_close_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text) - pending, in_progress, completed
      - `priority` (text) - low, medium, high
      - `due_date` (timestamptz)
      - `assigned_to` (text)
      - `related_to_type` (text) - lead, customer, deal
      - `related_to_id` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `activities`
      - `id` (uuid, primary key)
      - `type` (text) - call, email, meeting, note
      - `title` (text)
      - `description` (text)
      - `related_to_type` (text) - lead, customer, deal
      - `related_to_id` (uuid)
      - `created_by` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demo mode)
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  status text DEFAULT 'new',
  source text DEFAULT 'website',
  assigned_to text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  address text DEFAULT '',
  industry text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  value numeric DEFAULT 0,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  status text DEFAULT 'new',
  assigned_to text,
  probability integer DEFAULT 50,
  expected_close_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  assigned_to text,
  related_to_type text,
  related_to_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  related_to_type text,
  related_to_id uuid,
  created_by text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo mode)
CREATE POLICY "Allow public read access to leads"
  ON leads FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to leads"
  ON leads FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to leads"
  ON leads FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to customers"
  ON customers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to customers"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to customers"
  ON customers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to customers"
  ON customers FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to deals"
  ON deals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to deals"
  ON deals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to deals"
  ON deals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to deals"
  ON deals FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to tasks"
  ON tasks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to tasks"
  ON tasks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to tasks"
  ON tasks FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to tasks"
  ON tasks FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to activities"
  ON activities FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to activities"
  ON activities FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to activities"
  ON activities FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to activities"
  ON activities FOR DELETE
  TO anon
  USING (true);