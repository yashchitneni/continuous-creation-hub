
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, isValid } from 'date-fns';

// Type definitions
export type HackathonStatus = 'upcoming' | 'active' | 'judging' | 'past' | 'all';

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: HackathonStatus;
  created_at: string;
  creator_id: string | null;
}

// Fetch all hackathons or filtered by status
export const useHackathons = (status?: HackathonStatus) => {
  return useQuery({
    queryKey: ['hackathons', status],
    queryFn: async () => {
      let query = supabase
        .from('hackathons')
        .select('*');
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Fetch a specific hackathon by ID
export const useHackathon = (hackathonId?: string) => {
  return useQuery({
    queryKey: ['hackathon', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return null;
      
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', hackathonId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!hackathonId
  });
};

// Check if a user is a participant in a hackathon
export const useIsHackathonParticipant = (hackathonId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['isHackathonParticipant', hackathonId, userId],
    queryFn: async () => {
      if (!hackathonId || !userId) return false;
      
      const { data, error } = await supabase
        .from('hackathon_participants')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!hackathonId && !!userId
  });
};

// Get the participant count for a hackathon
export const useHackathonParticipantCount = (hackathonId?: string) => {
  return useQuery({
    queryKey: ['hackathonParticipantCount', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return 0;
      
      const { count, error } = await supabase
        .from('hackathon_participants')
        .select('*', { count: 'exact', head: true })
        .eq('hackathon_id', hackathonId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!hackathonId
  });
};

// Fetch participants of a hackathon
export const useHackathonParticipants = (hackathonId?: string) => {
  return useQuery({
    queryKey: ['hackathonParticipants', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return [];
      
      const { data, error } = await supabase
        .from('hackathon_participants')
        .select(`
          *,
          users:user_id (
            id, email, username, avatar_url
          )
        `)
        .eq('hackathon_id', hackathonId);
      
      if (error) throw error;
      
      // Format the date for each participant
      return data?.map(participant => {
        // Create a formatted date string or a fallback
        let joinedDate = 'Unknown date';
        if (participant.created_at && isValid(new Date(participant.created_at))) {
          joinedDate = format(new Date(participant.created_at), 'MMM d, yyyy');
        }
        
        return {
          ...participant,
          joinedDate
        };
      }) || [];
    },
    enabled: !!hackathonId
  });
};

// Join a hackathon
export const useJoinHackathon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hackathonId, userId }: { hackathonId: string; userId: string }) => {
      // First check if already a participant
      const { data: existingParticipant, error: checkError } = await supabase
        .from('hackathon_participants')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingParticipant) {
        throw new Error('You have already joined this hackathon');
      }
      
      const { data, error } = await supabase
        .from('hackathon_participants')
        .insert([{ hackathon_id: hackathonId, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hackathonParticipants', variables.hackathonId] });
      queryClient.invalidateQueries({ queryKey: ['hackathonParticipantCount', variables.hackathonId] });
      queryClient.invalidateQueries({ queryKey: ['isHackathonParticipant', variables.hackathonId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userHackathons', variables.userId] });
      toast({
        title: 'Success!',
        description: 'You have joined the hackathon.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join the hackathon.',
        variant: 'destructive',
      });
    }
  });
};

// Delete a hackathon
export const useDeleteHackathon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hackathonId: string) => {
      // First check if hackathon has participants
      const { count, error: countError } = await supabase
        .from('hackathon_participants')
        .select('*', { count: 'exact', head: true })
        .eq('hackathon_id', hackathonId);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        throw new Error('Cannot delete a hackathon with participants. Please remove all participants first.');
      }
      
      const { error } = await supabase
        .from('hackathons')
        .delete()
        .eq('id', hackathonId);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      toast({
        title: 'Hackathon deleted',
        description: 'The hackathon has been successfully deleted.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting hackathon',
        description: error.message || 'Failed to delete the hackathon.',
        variant: 'destructive',
      });
    }
  });
};

// Create a new hackathon
export const useCreateHackathon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hackathon: Omit<Hackathon, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('hackathons')
        .insert([hackathon])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      toast({
        title: 'Hackathon created',
        description: 'Your hackathon has been created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating hackathon',
        description: error.message || 'An error occurred while creating the hackathon.',
        variant: 'destructive',
      });
    }
  });
};
