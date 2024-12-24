import { supabase } from '../supabase';
import type { Finance } from '../../types/database';

export const financesApi = {
  async list() {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(finance: Finance['Insert']) {
    const { data, error } = await supabase
      .from('finances')
      .insert([finance])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('finances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};