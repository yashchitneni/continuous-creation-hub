
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserHackathons = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userHackathons', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('hackathon_participants')
        .select(`
          hackathon_id,
          hackathons:hackathons(*)
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      return data?.map(item => item.hackathons) || [];
    },
    enabled: !!userId
  });
};
