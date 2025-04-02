
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  Clock,
  CheckCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the possible hackathon phases and their transitions
export type HackathonPhase = 'upcoming' | 'active' | 'judging' | 'past';

interface PhaseInfo {
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  nextPhase?: HackathonPhase;
}

interface HackathonPhaseManagerProps {
  hackathonId: string;
  currentPhase: HackathonPhase;
  participantCount: number;
  projectCount: number;
  isCreator: boolean;
  onPhaseChanged: () => void;
}

const HackathonPhaseManager: React.FC<HackathonPhaseManagerProps> = ({
  hackathonId,
  currentPhase,
  participantCount,
  projectCount,
  isCreator,
  onPhaseChanged
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Phase information with metadata for UI rendering
  const phases: Record<HackathonPhase, PhaseInfo> = {
    upcoming: {
      label: 'Upcoming',
      icon: <Calendar className="h-5 w-5" />,
      description: 'The hackathon hasn\'t started yet. Participants can join but not submit projects.',
      color: 'bg-blue-100 text-blue-800',
      nextPhase: 'active'
    },
    active: {
      label: 'Active',
      icon: <Clock className="h-5 w-5" />,
      description: 'The hackathon is in progress. Participants can submit and work on their projects.',
      color: 'bg-green-100 text-green-800',
      nextPhase: 'judging'
    },
    judging: {
      label: 'Judging',
      icon: <CheckCircle className="h-5 w-5" />,
      description: 'Submissions are closed. Participants can now vote on projects.',
      color: 'bg-amber-100 text-amber-800',
      nextPhase: 'past'
    },
    past: {
      label: 'Completed',
      icon: <Award className="h-5 w-5" />,
      description: 'The hackathon has ended. Results are final.',
      color: 'bg-gray-100 text-gray-800'
    }
  };

  // Get the next phase if it exists
  const nextPhase = phases[currentPhase].nextPhase;

  // Don't render anything if the user is not the creator
  if (!isCreator) return null;

  // Check if advancing to the next phase is possible
  const canAdvanceToNextPhase = (): { canAdvance: boolean; message?: string } => {
    if (!nextPhase) {
      return { canAdvance: false, message: 'This hackathon is already completed.' };
    }

    // For active phase, there needs to be at least one participant
    if (currentPhase === 'upcoming' && participantCount === 0) {
      return { canAdvance: false, message: 'At least one participant is required before starting the hackathon.' };
    }

    // For judging phase, there needs to be at least one project
    if (currentPhase === 'active' && projectCount === 0) {
      return { canAdvance: false, message: 'At least one project submission is required before moving to judging phase.' };
    }

    return { canAdvance: true };
  };

  const { canAdvance, message } = canAdvanceToNextPhase();

  // Advance to the next phase
  const advanceToNextPhase = async () => {
    if (!nextPhase || !canAdvance) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('update_hackathon_status', {
        p_hackathon_id: hackathonId,
        p_status: nextPhase
      });
      
      if (error) throw error;
      
      toast({
        title: 'Phase Updated',
        description: `The hackathon is now in ${phases[nextPhase].label} phase.`,
      });
      
      setIsOpen(false);
      onPhaseChanged();
    } catch (err: any) {
      console.error('Error updating phase:', err);
      setError(err.message || 'Failed to update the hackathon phase');
      
      toast({
        title: 'Update Failed',
        description: err.message || 'Failed to update the hackathon phase',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!canAdvance || isUpdating}
          >
            <Clock className="h-4 w-4" />
            Manage Phase
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Advance Hackathon Phase</AlertDialogTitle>
            <AlertDialogDescription>
              {nextPhase ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${phases[currentPhase].color}`}>
                      {phases[currentPhase].icon}
                    </div>
                    <div className="font-medium">{phases[currentPhase].label}</div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className={`p-2 rounded-full ${phases[nextPhase].color}`}>
                      {phases[nextPhase].icon}
                    </div>
                    <div className="font-medium">{phases[nextPhase].label}</div>
                  </div>
                  
                  <p>
                    {currentPhase === 'upcoming' ? 
                      'This will start the hackathon. Participants can begin submitting projects.' :
                      currentPhase === 'active' ? 
                      'This will end the submission period. No new projects can be submitted after this.' :
                      currentPhase === 'judging' ? 
                      'This will mark the hackathon as completed. Results will be final.' : 
                      'Are you sure you want to change the phase?'}
                  </p>
                  
                  {!canAdvance && message && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                      <p className="text-sm">{message}</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                      <p className="font-medium">Error:</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>This hackathon is already completed.</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                advanceToNextPhase();
              }}
              disabled={!canAdvance || isUpdating}
              className={!canAdvance ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isUpdating ? 'Updating...' : `Move to ${nextPhase ? phases[nextPhase].label : ''}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HackathonPhaseManager;
