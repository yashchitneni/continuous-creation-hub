
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
      
      // Update the hackathon without using .single()
      // This is the key change - we're doing a direct update by ID without expecting
      // exactly one row to be returned in the response
      const { data, error } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', hackathonId)
        .select('*');
      
      if (error) {
        console.error('Update error:', error);
        throw new Error(`Failed to update hackathon phase: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after update');
      }
      
      console.log('Update successful:', data[0]);
      return data[0];
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
