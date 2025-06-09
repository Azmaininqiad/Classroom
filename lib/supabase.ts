import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      classrooms: {
        Row: {
          id: string;
          name: string;
          subject: string;
          class_code: string;
          description: string | null;
          created_by: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          class_code: string;
          description?: string | null;
          created_by: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          class_code?: string;
          description?: string | null;
          created_by?: string;
          color?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          classroom_id: string;
          author_name: string;
          author_role: 'teacher' | 'student';
          content: string;
          type: 'announcement' | 'material';
          attachments: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          author_name: string;
          author_role: 'teacher' | 'student';
          content: string;
          type: 'announcement' | 'material';
          attachments?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          author_name?: string;
          author_role?: 'teacher' | 'student';
          content?: string;
          type?: 'announcement' | 'material';
          attachments?: string[] | null;
          created_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          classroom_id: string;
          title: string;
          description: string;
          due_date: string;
          points: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          title: string;
          description: string;
          due_date: string;
          points?: number;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          points?: number;
          created_by?: string;
          created_at?: string;
        };
      };
      classroom_members: {
        Row: {
          id: string;
          classroom_id: string;
          name: string;
          email: string;
          role: 'teacher' | 'student';
          joined_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          name: string;
          email: string;
          role: 'teacher' | 'student';
          joined_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          name?: string;
          email?: string;
          role?: 'teacher' | 'student';
          joined_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_name: string;
          content: string;
          attachments: string[] | null;
          status: 'submitted' | 'late' | 'missing';
          submitted_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_name: string;
          content: string;
          attachments?: string[] | null;
          status?: 'submitted' | 'late' | 'missing';
          submitted_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_name?: string;
          content?: string;
          attachments?: string[] | null;
          status?: 'submitted' | 'late' | 'missing';
          submitted_at?: string;
        };
      };
    };
  };
};