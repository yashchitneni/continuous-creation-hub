
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useResource = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['resource', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('title');
        
      if (error) throw error;
      return data || [];
    }
  });
};
