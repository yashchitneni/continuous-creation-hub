
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Clock, Calendar, CheckCircle, Award, Calendar as CalendarIcon } from 'lucide-react';
import { useUpdateHackathonPhase, HackathonStatus as PhaseStatus } from '@/hooks/useUpdateHackathonPhase';
import { toast } from '@/hooks/use-toast';

interface PhaseManagerProps {
  hackathon: {
    id: string;
    status: string;
  };
  isCreator: boolean;
}

// Use the ones from useUpdateHackathonPhase
const VALID_STATUSES: PhaseStatus[] = ['upcoming', 'active', 'judging', 'past'];

const PhaseManager: React.FC<PhaseManagerProps> = ({ hackathon, isCreator }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [targetPhase, setTargetPhase] = useState<PhaseStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const updateHackathonPhase = useUpdateHackathonPhase();

  if (!isCreator) return null;

  // Ensure we're using a valid status
  const currentStatus = VALID_STATUSES.includes(hackathon.status as PhaseStatus) 
    ? (hackathon.status as PhaseStatus)
    : 'upcoming';

  const handlePhaseSelect = (phase: PhaseStatus) => {
    if (phase === currentStatus) {
      toast({
        title: "No Change Needed",
        description: `The hackathon is already in ${phase} phase.`
      });
      return;
    }
    
    setUpdateError(null);
    setTargetPhase(phase);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmPhaseChange = async () => {
    if (!targetPhase || isUpdating) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      console.log('Confirming phase change to:', targetPhase);
      
      await updateHackathonPhase.mutateAsync({
        hackathonId: hackathon.id,
        status: targetPhase
      });
      
      setIsConfirmDialogOpen(false);
      setTargetPhase(null);
    } catch (error: any) {
      console.error('Failed to update phase:', error);
      setUpdateError(error.message || 'An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPhaseIcon = (phase: PhaseStatus) => {
    switch (phase) {
      case 'upcoming': return <Calendar className="h-4 w-4 mr-2" />;
      case 'active': return <Clock className="h-4 w-4 mr-2" />;
      case 'judging': return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'past': return <Award className="h-4 w-4 mr-2" />;
      default: return <CalendarIcon className="h-4 w-4 mr-2" />;
    }
  };

  const getConfirmationMessage = () => {
    if (!targetPhase) return '';
    
    switch (targetPhase) {
      case 'active':
        return 'Start the hackathon and allow participants to submit projects?';
      case 'judging':
        return 'End submissions and move to the judging phase? No new projects can be submitted.';
      case 'past':
        return 'Mark this hackathon as completed? This will archive the hackathon.';
      default:
        return `Are you sure you want to change the phase to ${targetPhase}?`;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Manage Phase
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handlePhaseSelect('upcoming')}>
            {getPhaseIcon('upcoming')}
            <span>Upcoming</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePhaseSelect('active')}>
            {getPhaseIcon('active')}
            <span>Active</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePhaseSelect('judging')}>
            {getPhaseIcon('judging')}
            <span>Judging</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePhaseSelect('past')}>
            {getPhaseIcon('past')}
            <span>Past</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog 
        open={isConfirmDialogOpen} 
        onOpenChange={(open) => {
          if (!isUpdating) {
            setIsConfirmDialogOpen(open);
            if (!open) {
              setTargetPhase(null);
              setUpdateError(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Phase Change</AlertDialogTitle>
            <AlertDialogDescription>
              {getConfirmationMessage()}
              
              {updateError && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                  <p className="font-medium">Error:</p>
                  <p>{updateError}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              Cancel
            </AlertDialogCancel>
            <Button 
              onClick={handleConfirmPhaseChange}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PhaseManager;
