
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
      // First, verify the hackathon exists
      const { data: existingHackathon, error: fetchError } = await supabase
        .from('hackathons')
        .select('id, status')
        .eq('id', hackathonId)
        .maybeSingle();
      
      if (fetchError) {
        throw new Error(`Failed to find hackathon: ${fetchError.message}`);
      }
      
      if (!existingHackathon) {
        throw new Error(`Hackathon with ID ${hackathonId} not found`);
      }
      
      // If the status is already the same, return the existing hackathon
      if (existingHackathon.status === status) {
        console.log(`Hackathon is already in ${status} phase. No update needed.`);
        return existingHackathon;
      }
      
      // Then update it with prefer header to handle multiple or no rows
      const { data, error } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', hackathonId)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Update error:', error);
        throw new Error(`Failed to update hackathon: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No hackathon was updated. The hackathon may not exist or you may not have permission to update it.');
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
