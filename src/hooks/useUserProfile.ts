
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  avatar_url?: string;
  created_at?: string;
}

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // First try the public users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();
          
      if (userError) {
        console.error("Error fetching user profile:", userError);
        return null;
      }
      
      return userData as UserProfile;
    },
    enabled: !!userId,
    retry: false
  });
};
