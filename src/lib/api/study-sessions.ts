import { supabase } from '../supabase';
import type { StudySession } from '../../types/database';

export const studySessionsApi = {
  async list() {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(session: StudySession['Insert']) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([session])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, session: StudySession['Update']) {
    const { data, error } = await supabase
      .from('study_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};