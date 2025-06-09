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
          attachments: string[] | null;
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
          attachments?: string[] | null;
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
          attachments?: string[] | null;
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
      answer_keys: {
        Row: {
          id: string;
          assignment_id: string;
          teacher_name: string;
          content: string | null;
          attachments: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          teacher_name: string;
          content?: string | null;
          attachments?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          teacher_name?: string;
          content?: string | null;
          attachments?: string[] | null;
          created_at?: string;
        };
      };
      evaluations: {
        Row: {
          id: string;
          assignment_id: string;
          submission_id: string;
          student_name: string | null;
          total_marks: number;
          obtained_marks: number;
          percentage: number;
          grade: string;
          correct_answers: string[];
          incorrect_answers: string[];
          partial_credit_areas: string[];
          strengths: string[];
          areas_for_improvement: string[];
          detailed_feedback: string;
          evaluation_type: string;
          batch_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          submission_id: string;
          student_name?: string | null;
          total_marks?: number;
          obtained_marks?: number;
          percentage?: number;
          grade?: string;
          correct_answers?: string[];
          incorrect_answers?: string[];
          partial_credit_areas?: string[];
          strengths?: string[];
          areas_for_improvement?: string[];
          detailed_feedback?: string;
          evaluation_type?: string;
          batch_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          submission_id?: string;
          student_name?: string | null;
          total_marks?: number;
          obtained_marks?: number;
          percentage?: number;
          grade?: string;
          correct_answers?: string[];
          incorrect_answers?: string[];
          partial_credit_areas?: string[];
          strengths?: string[];
          areas_for_improvement?: string[];
          detailed_feedback?: string;
          evaluation_type?: string;
          batch_id?: string | null;
          created_at?: string;
        };
      };
      evaluation_batches: {
        Row: {
          id: string;
          assignment_id: string;
          teacher_name: string;
          total_submissions: number;
          completed_evaluations: number;
          status: string;
          summary: any;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          teacher_name: string;
          total_submissions?: number;
          completed_evaluations?: number;
          status?: string;
          summary?: any;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          teacher_name?: string;
          total_submissions?: number;
          completed_evaluations?: number;
          status?: string;
          summary?: any;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
          location: string | null;
          website: string | null;
          achievements: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          website?: string | null;
          achievements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          website?: string | null;
          achievements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          author_id: string | null;
          author_name: string;
          author_avatar: string | null;
          content: string;
          event_type: string;
          attachments: string[] | null;
          location: string | null;
          event_date: string | null;
          tags: string[] | null;
          reactions_count: number;
          comments_count: number;
          shares_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          author_name: string;
          author_avatar?: string | null;
          content: string;
          event_type?: string;
          attachments?: string[] | null;
          location?: string | null;
          event_date?: string | null;
          tags?: string[] | null;
          reactions_count?: number;
          comments_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          author_name?: string;
          author_avatar?: string | null;
          content?: string;
          event_type?: string;
          attachments?: string[] | null;
          location?: string | null;
          event_date?: string | null;
          tags?: string[] | null;
          reactions_count?: number;
          comments_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_comments: {
        Row: {
          id: string;
          event_id: string;
          author_name: string;
          author_avatar: string | null;
          content: string;
          parent_comment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          author_name: string;
          author_avatar?: string | null;
          content: string;
          parent_comment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          author_name?: string;
          author_avatar?: string | null;
          content?: string;
          parent_comment_id?: string | null;
          created_at?: string;
        };
      };
      event_reactions: {
        Row: {
          id: string;
          event_id: string;
          user_identifier: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_identifier: string;
          reaction_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_identifier?: string;
          reaction_type?: string;
          created_at?: string;
        };
      };
    };
  };
};