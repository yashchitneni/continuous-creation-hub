
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // First check auth.users to get user details
      const { data: userAuth, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError || !userAuth || !userAuth.user) {
        // Now try the public users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (userError) return null;
        return userData;
      }
      
      // If we have the auth user, also try to get more profile details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Return combined data if both are available
      if (userData) {
        return {
          ...userData,
          email: userAuth.user.email || userData.email
        };
      }
      
      // Fall back to just the auth data
      return {
        id: userAuth.user.id,
        email: userAuth.user.email,
        username: userAuth.user.user_metadata?.username || 'User'
      };
    },
    enabled: !!userId,
    retry: false
  });
};
