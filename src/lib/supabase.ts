// '''import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export type FeedbackItem = {
//   id: string;
//   customer_name: string;
//   source: 'App Store' | 'Play Store' | 'Email';
//   feedback_text: string;
//   category: 'Bug' | 'Feature Request' | 'Billing' | null;
//   urgency: 'Critical' | 'Medium' | 'Low';
//   status: 'Pending' | 'Processed';
//   sentiment_score: number | null;
//   created_at: string;
// };

// export type FeedbackInsert = {
//   customer_name: string;
//   source: string;
//   feedback_text: string;
//   urgency: string;
//   category?: string;
//   status?: string;
// };


// Safe Mock Configuration for Local Demo Environment
const supabaseUrl = "mock-url";
const supabaseAnonKey = "mock-key";

// We create a fake mock client that mimics the Supabase API structure 
// so the application components can fetch data without crashing.
export const supabase = {
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => ({
      eq: () => Promise.resolve({ data: [], error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: [], error: null })
    })
  })
};

export type FeedbackItem = {
  id: string;
  customer_name: string;
  source: 'App Store' | 'Play Store' | 'Email';
  feedback_text: string;
  category: 'Bug' | 'Feature Request' | 'Billing' | null;
  urgency: 'Critical' | 'Medium' | 'Low';
  status: 'Pending' | 'Processed';
  sentiment_score: number | null;
  created_at: string;
};

export type FeedbackInsert = {
  customer_name: string;
  source: string;
  feedback_text: string;
  urgency: string;
  category?: string;
  status?: string;
};

