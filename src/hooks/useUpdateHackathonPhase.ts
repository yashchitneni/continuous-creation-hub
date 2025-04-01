
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HackathonStatus } from './useHackathons';

interface UpdateHackathonPhaseParams {
  hackathonId: string;
  status: HackathonStatus;
}

export const useUpdateHackathonPhase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hackathonId, status }: UpdateHackathonPhaseParams) => {
      // First fetch the current hackathon to make sure it exists
      const { data: hackathon, error: fetchError } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', hackathonId)
        .single();
      
      if (fetchError) {
        throw new Error(`Failed to find hackathon: ${fetchError.message}`);
      }
      
      // Then update it
      const { data, error } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', hackathonId)
        .select()
        .maybeSingle(); // Using maybeSingle() instead of single() to handle cases where the row might not be found
      
      if (error) {
        throw new Error(`Failed to update hackathon: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No hackathon was updated');
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      queryClient.invalidateQueries({ queryKey: ['hackathon', data.id] });
      
      toast({
        title: 'Hackathon phase updated',
        description: `The hackathon is now in ${data.status} phase.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating hackathon phase:', error);
      toast({
        title: 'Error updating hackathon phase',
        description: error.message || 'An error occurred while updating the hackathon phase.',
        variant: 'destructive',
      });
    }
  });
};
