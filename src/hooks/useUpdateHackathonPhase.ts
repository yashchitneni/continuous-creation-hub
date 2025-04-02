
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HackathonStatus } from '@/hooks/useHackathons';

interface UpdateHackathonPhaseParams {
  hackathonId: string;
  status: HackathonStatus;
}

// Define valid phase transitions
const validTransitions: Record<string, HackathonStatus[]> = {
  upcoming: ['active'],
  active: ['judging'],
  judging: ['past'],
  past: []
};

export const useUpdateHackathonPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ hackathonId, status }: UpdateHackathonPhaseParams) => {
      console.log('Starting phase update mutation for hackathon:', hackathonId, 'to status:', status);
      
      // Validate the transition
      const { data: currentHackathon, error: fetchError } = await supabase
        .from('hackathons')
        .select('status')
        .eq('id', hackathonId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current hackathon status:', fetchError);
        throw new Error(`Failed to fetch current hackathon status: ${fetchError.message}`);
      }
      
      const currentStatus = currentHackathon.status as HackathonStatus;
      
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
      console.log('Updating hackathon status to:', status);
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
    },
    onSuccess: (data) => {
      console.log('Phase update mutation succeeded:', data);
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
