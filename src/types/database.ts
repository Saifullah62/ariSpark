export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  major: string | null;
  year_of_study: number | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: 'income' | 'expense';
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  duration: number;
  notes: string | null;
  started_at: string;
  ended_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Goal, 'id'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id'>>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Document, 'id'>>;
      };
      finances: {
        Row: Finance;
        Insert: Omit<Finance, 'id' | 'created_at'>;
        Update: Partial<Omit<Finance, 'id'>>;
      };
      study_sessions: {
        Row: StudySession;
        Insert: Omit<StudySession, 'id'>;
        Update: Partial<Omit<StudySession, 'id'>>;
      };
    };
  };
}