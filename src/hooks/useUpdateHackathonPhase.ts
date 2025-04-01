
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
      console.log('Updating hackathon phase:', { hackathonId, status });
      
      // First, verify the hackathon exists
      const { data: existingHackathon, error: fetchError } = await supabase
        .from('hackathons')
        .select('id, status')
        .eq('id', hackathonId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching hackathon:', fetchError);
        throw new Error(`Failed to find hackathon: ${fetchError.message}`);
      }
      
      if (!existingHackathon) {
        console.error('Hackathon not found:', hackathonId);
        throw new Error(`Hackathon with ID ${hackathonId} not found`);
      }
      
      // If the status is already the same, return early
      if (existingHackathon.status === status) {
        console.log(`Hackathon is already in ${status} phase. No update needed.`);
        return existingHackathon;
      }
      
      console.log('Current status:', existingHackathon.status, 'New status:', status);
      
      // CRITICAL CHANGE: Just perform the update without expecting any data return
      // We'll fetch the updated record separately after the update is successful
      const { error: updateError } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', hackathonId);
      
      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update hackathon phase: ${updateError.message}`);
      }
      
      // Now fetch the updated hackathon data
      const { data: updatedHackathon, error: refetchError } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', hackathonId)
        .maybeSingle();
        
      if (refetchError) {
        console.error('Error refetching hackathon:', refetchError);
        throw new Error(`Failed to retrieve updated hackathon: ${refetchError.message}`);
      }
      
      if (!updatedHackathon) {
        throw new Error('Could not retrieve the updated hackathon');
      }
      
      console.log('Update successful:', updatedHackathon);
      return updatedHackathon;
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
