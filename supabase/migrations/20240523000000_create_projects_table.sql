-- Create custom types for enums
CREATE TYPE project_status AS ENUM ('draft', 'analyzing', 'approved', 'backlog', 'in_progress', 'qa', 'prod');
CREATE TYPE effort_size AS ENUM ('S', 'M', 'L', 'XL');

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  business_value TEXT,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 5),
  urgency_score INTEGER CHECK (urgency_score >= 1 AND urgency_score <= 5),
  effort_size effort_size NOT NULL,
  calculated_priority FLOAT,
  status project_status DEFAULT 'draft'
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all actions for now (since we are in early dev, will restrict later)
CREATE POLICY "Enable all access for all users" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);
