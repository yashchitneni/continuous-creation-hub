
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Use the exact same type as in useHackathons.ts but without the 'all' option
export type HackathonStatus = 'upcoming' | 'active' | 'judging' | 'past';

interface UpdateHackathonPhaseParams {
  hackathonId: string;
  status: HackathonStatus;
}

// Define valid phase transitions - ensuring only valid statuses are used
const validTransitions: Record<string, HackathonStatus[]> = {
  upcoming: ['active'],
  active: ['judging'],
  judging: ['past'],
  past: []
};

// These are the exact values allowed by the database constraint
// Must match exactly what's in the database 'hackathons_status_check' constraint
const VALID_DB_STATUSES: HackathonStatus[] = ['upcoming', 'active', 'judging', 'past'];

export const useUpdateHackathonPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ hackathonId, status }: UpdateHackathonPhaseParams) => {
      console.log('Starting phase update mutation for hackathon:', hackathonId, 'to status:', status);
      
      // First, verify the status is a valid database value
      if (!VALID_DB_STATUSES.includes(status)) {
        console.error('Invalid status value:', status);
        throw new Error(`Invalid status value: ${status}. Must be one of: ${VALID_DB_STATUSES.join(', ')}`);
      }
      
      try {
        // Validate the transition
        const { data: currentHackathon, error: fetchError } = await supabase
          .from('hackathons')
          .select('status')
          .eq('id', hackathonId)
          .maybeSingle();
        
        if (fetchError) {
          console.error('Error fetching current hackathon status:', fetchError);
          throw new Error(`Failed to fetch current hackathon status: ${fetchError.message}`);
        }
        
        if (!currentHackathon) {
          throw new Error('Hackathon not found');
        }
        
        const currentStatus = currentHackathon.status as HackathonStatus;
        console.log('Current status:', currentStatus, 'Target status:', status);
        
        // Check if the transition is valid
        if (!validTransitions[currentStatus]?.includes(status)) {
          throw new Error(`Invalid phase transition from ${currentStatus} to ${status}`);
        }
        
        // For judging phase, ensure there are projects
        if (status === 'judging') {
          const { count, error: projectsError } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('hackathon_id', hackathonId);
          
          if (projectsError) {
            console.error('Error counting projects:', projectsError);
            throw new Error(`Failed to count projects: ${projectsError.message}`);
          }
          
          if (count === 0) {
            throw new Error('Cannot transition to judging phase as there are no submitted projects');
          }
        }
        
        // Update the hackathon status
        const { data, error: updateError } = await supabase
          .from('hackathons')
          .update({ status })
          .eq('id', hackathonId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating hackathon status:', updateError);
          throw new Error(`Failed to update hackathon status: ${updateError.message}`);
        }
        
        console.log('Successfully updated hackathon status:', data);
        return data;
      } catch (error: any) {
        console.error('Update operation failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Phase update mutation succeeded:', data);
      // Invalidate queries to update UI state
      queryClient.invalidateQueries({ queryKey: ['hackathon', data.id] });
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      
      toast({
        title: 'Phase Updated',
        description: `The hackathon is now in ${data.status} phase.`,
      });
    },
    onError: (error: any) => {
      console.error('Phase update mutation failed:', error);
      toast({
        title: 'Error Updating Phase',
        description: error.message || 'Failed to update hackathon phase',
        variant: 'destructive',
      });
    }
  });
};
