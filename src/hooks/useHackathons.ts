import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type HackathonStatus = 'upcoming' | 'active' | 'judging' | 'past';

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: HackathonStatus;
  created_at: string;
}

// Fetch all hackathons with optional status filter
export const useHackathons = (status?: HackathonStatus) => {
  return useQuery({
    queryKey: ['hackathons', status],
    queryFn: async () => {
      let query = supabase.from('hackathons').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('start_date', { ascending: status === 'past' ? false : true });
      
      if (error) throw error;
      return data as Hackathon[];
    }
  });
};

// Fetch a single hackathon by ID
export const useHackathon = (id?: string) => {
  return useQuery({
    queryKey: ['hackathon', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Hackathon | null;
    },
    enabled: !!id
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

// Update hackathon status
export const useUpdateHackathonStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: HackathonStatus }) => {
      const { data, error } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      queryClient.invalidateQueries({ queryKey: ['hackathon', variables.id] });
      toast({
        title: 'Hackathon updated',
        description: `Hackathon status has been updated to ${variables.status}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating hackathon',
        description: error.message || 'An error occurred while updating the hackathon.',
        variant: 'destructive',
      });
    }
  });
};

// Get participant count for a hackathon
export const useHackathonParticipantCount = (hackathonId?: string) => {
  return useQuery({
    queryKey: ['hackathonParticipants', 'count', hackathonId],
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

// Check if user is a participant
export const useIsHackathonParticipant = (hackathonId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['hackathonParticipant', hackathonId, userId],
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

// Join a hackathon
export const useJoinHackathon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hackathonId, userId }: { hackathonId: string, userId: string }) => {
      // Check if already joined
      const { data: existingParticipant, error: checkError } = await supabase
        .from('hackathon_participants')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If already joined, return early
      if (existingParticipant) {
        return existingParticipant;
      }
      
      // Otherwise, join the hackathon
      const { data, error } = await supabase
        .from('hackathon_participants')
        .insert([{ hackathon_id: hackathonId, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hackathonParticipants', 'count', variables.hackathonId] });
      queryClient.invalidateQueries({ queryKey: ['hackathonParticipant', variables.hackathonId, variables.userId] });
      toast({
        title: 'Joined hackathon',
        description: 'You have joined the hackathon successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error joining hackathon',
        description: error.message || 'An error occurred while joining the hackathon.',
        variant: 'destructive',
      });
    }
  });
};
