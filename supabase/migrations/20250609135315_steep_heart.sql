/*
  # Create AI Evaluation System Tables

  1. New Tables
    - `answer_keys` - Store answer keys for assignments (only teachers can upload)
    - `evaluations` - Store AI evaluation results
    - `evaluation_batches` - Track multiple evaluations

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth required)
*/

-- Create answer_keys table
CREATE TABLE IF NOT EXISTS answer_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  teacher_name text NOT NULL,
  content text,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  student_name text,
  total_marks integer DEFAULT 100,
  obtained_marks integer DEFAULT 0,
  percentage numeric(5,2) DEFAULT 0.00,
  grade text DEFAULT 'F',
  correct_answers text[],
  incorrect_answers text[],
  partial_credit_areas text[],
  strengths text[],
  areas_for_improvement text[],
  detailed_feedback text,
  evaluation_type text DEFAULT 'single' CHECK (evaluation_type IN ('single', 'multiple')),
  batch_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create evaluation_batches table for tracking multiple evaluations
CREATE TABLE IF NOT EXISTS evaluation_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  teacher_name text NOT NULL,
  total_submissions integer DEFAULT 0,
  completed_evaluations integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  summary jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_batches ENABLE ROW LEVEL SECURITY;

-- Create policies for answer_keys (public access)
CREATE POLICY "Anyone can view answer keys"
  ON answer_keys FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create answer keys"
  ON answer_keys FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update answer keys"
  ON answer_keys FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete answer keys"
  ON answer_keys FOR DELETE
  TO public
  USING (true);

-- Create policies for evaluations (public access)
CREATE POLICY "Anyone can view evaluations"
  ON evaluations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create evaluations"
  ON evaluations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update evaluations"
  ON evaluations FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete evaluations"
  ON evaluations FOR DELETE
  TO public
  USING (true);

-- Create policies for evaluation_batches (public access)
CREATE POLICY "Anyone can view evaluation batches"
  ON evaluation_batches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create evaluation batches"
  ON evaluation_batches FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update evaluation batches"
  ON evaluation_batches FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete evaluation batches"
  ON evaluation_batches FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_answer_keys_assignment_id ON answer_keys(assignment_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_assignment_id ON evaluations(assignment_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_submission_id ON evaluations(submission_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_batch_id ON evaluations(batch_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_batches_assignment_id ON evaluation_batches(assignment_id);