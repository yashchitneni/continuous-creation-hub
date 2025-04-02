
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
import { useUpdateHackathonPhase } from '@/hooks/useUpdateHackathonPhase';
import { HackathonStatus } from '@/hooks/useHackathons';
import { toast } from '@/hooks/use-toast';

interface PhaseManagerProps {
  hackathon: {
    id: string;
    status: HackathonStatus;
  };
  isCreator: boolean;
}

const PhaseManager: React.FC<PhaseManagerProps> = ({ hackathon, isCreator }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [targetPhase, setTargetPhase] = useState<HackathonStatus | null>(null);
  const updateHackathonPhase = useUpdateHackathonPhase();

  if (!isCreator) return null;

  const handlePhaseSelect = (phase: HackathonStatus) => {
    if (phase === hackathon.status) {
      toast({
        title: "No Change Needed",
        description: `The hackathon is already in ${phase} phase.`
      });
      return;
    }
    
    setTargetPhase(phase);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmPhaseChange = async () => {
    if (!targetPhase) return;
    
    try {
      await updateHackathonPhase.mutateAsync({
        hackathonId: hackathon.id,
        status: targetPhase
      });
      // The dialog will be closed in the useEffect below when isSuccess becomes true
    } catch (error) {
      // Error is handled by the mutation's onError
      // Just ensure the dialog stays open so user can try again or cancel
    }
  };

  const getPhaseIcon = (phase: HackathonStatus) => {
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
          // Only allow closing if we're not in the middle of updating
          if (!updateHackathonPhase.isPending) {
            setIsConfirmDialogOpen(open);
            if (!open) setTargetPhase(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Phase Change</AlertDialogTitle>
            <AlertDialogDescription>
              {getConfirmationMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateHackathonPhase.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button 
              onClick={handleConfirmPhaseChange}
              disabled={updateHackathonPhase.isPending}
            >
              {updateHackathonPhase.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PhaseManager;
