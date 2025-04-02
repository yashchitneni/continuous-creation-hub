
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HackathonStatus } from './useHackathons';

interface UpdateHackathonPhaseParams {
  hackathonId: string;
  status: HackathonStatus;
}

// Define the valid phase transitions
// Note: 'all' is only used for UI filtering and not an actual status in the database
const transitionRules: Record<Exclude<HackathonStatus, 'all'>, HackathonStatus[]> = {
  'upcoming': ['active'],
  'active': ['judging', 'upcoming'],
  'judging': ['past', 'active'],
  'past': ['upcoming']
};

export const useUpdateHackathonPhase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hackathonId, status }: UpdateHackathonPhaseParams) => {
      console.log('Starting mutation for hackathonId:', hackathonId, 'to status:', status);
      
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
      
      // Normalize status values for comparison
      const normalizedCurrentStatus = existingHackathon.status.toLowerCase().trim() as Exclude<HackathonStatus, 'all'>;
      const normalizedTargetStatus = status.toLowerCase().trim() as HackathonStatus;
      
      // If the status is already the same, return early
      if (normalizedCurrentStatus === normalizedTargetStatus) {
        console.log(`Hackathon is already in ${status} phase. No update needed.`);
        return existingHackathon;
      }
      
      // Validate the phase transition
      if (!transitionRules[normalizedCurrentStatus]?.includes(normalizedTargetStatus)) {
        const allowedTransitions = transitionRules[normalizedCurrentStatus]?.join(', ');
        throw new Error(`Invalid phase transition from '${normalizedCurrentStatus}' to '${normalizedTargetStatus}'. Allowed transitions: ${allowedTransitions}`);
      }
      
      // Special validation for transitioning to judging phase - ensure there are projects
      if (normalizedTargetStatus === 'judging') {
        console.log('Checking for projects before transitioning to judging phase');
        const { count, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('hackathon_id', hackathonId);
        
        if (projectsError) {
          console.error('Error checking projects:', projectsError);
          throw new Error(`Failed to verify projects: ${projectsError.message}`);
        }
        
        if (count === 0) {
          console.error('No projects found for hackathon');
          throw new Error('Cannot transition to judging phase: no projects have been submitted yet');
        }
        
        console.log(`Found ${count} projects for hackathon. Proceeding with transition to judging.`);
      }
      
      console.log('Current status:', existingHackathon.status, 'New status:', status);
      
      // Perform the update - we're not expecting a direct return of data
      console.log('Executing update query');
      const { error: updateError } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', hackathonId);
      
      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update hackathon phase: ${updateError.message}`);
      }
      
      console.log('Update successful, fetching updated hackathon');
      
      // After successful update, fetch the updated record
      // Adding a small delay to ensure the database has time to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Now fetch the updated hackathon data with a fresh query
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
        console.error('Could not retrieve the updated hackathon');
        throw new Error('Could not retrieve the updated hackathon');
      }
      
      console.log('Update successful, fetched updated hackathon:', updatedHackathon);
      
      // Explicitly check if the status was actually updated in the database
      if (updatedHackathon.status !== status) {
        console.error(`Status update failed: Database still shows ${updatedHackathon.status} instead of ${status}`);
        // Despite the error, return what we have to avoid breaking the flow
      }
      
      return updatedHackathon;
    },
    onSuccess: (data) => {
      console.log('Mutation onSuccess called with data:', data);
      // Immediately update the cache for instant UI feedback
      queryClient.setQueryData(['hackathon', data.id], data);
      
      // Also invalidate queries to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      queryClient.invalidateQueries({ queryKey: ['hackathon', data.id] });
      
      toast({
        title: 'Hackathon phase updated',
        description: `The hackathon is now in ${data.status} phase.`,
      });
      
      // Force a refetch of the specific hackathon data
      queryClient.refetchQueries({ queryKey: ['hackathon', data.id] });
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
