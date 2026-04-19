export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'frontend' | 'backend' | 'dsa' | 'system_design';
  starter_code: string;
  solution: string;
  created_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  question_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  question?: Question;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string;
  code: string;
  score: number;
  feedback: string;
  created_at: string;
  question?: Question;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_score: number;
  rank: number;
  user?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
