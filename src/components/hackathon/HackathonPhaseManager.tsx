
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Clock, Calendar, CheckCircle, Award } from 'lucide-react';
import { useUpdateHackathonPhase } from '@/hooks/useUpdateHackathonPhase';
import { toast } from '@/hooks/use-toast';

// Define the valid phase statuses
type PhaseStatus = 'upcoming' | 'active' | 'judging' | 'past';

interface HackathonPhaseManagerProps {
  hackathonId: string;
  currentPhase: string; // Accept string to avoid type conflicts
  isCreator: boolean;
  onPhaseChanged: () => void;
}

const HackathonPhaseManager: React.FC<HackathonPhaseManagerProps> = ({
  hackathonId,
  currentPhase,
  isCreator,
  onPhaseChanged,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetPhase, setTargetPhase] = useState<PhaseStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const updatePhase = useUpdateHackathonPhase();

  if (!isCreator) return null;

  // Ensure we're using a valid status for the current phase
  const validPhases: PhaseStatus[] = ['upcoming', 'active', 'judging', 'past'];
  const safeCurrentPhase = validPhases.includes(currentPhase as PhaseStatus) 
    ? (currentPhase as PhaseStatus) 
    : 'upcoming';

  const phaseOptions: Record<PhaseStatus, { label: string; icon: React.ReactNode; nextPhase?: PhaseStatus }> = {
    upcoming: { label: 'Upcoming', icon: <Calendar className="h-4 w-4" />, nextPhase: 'active' },
    active: { label: 'Active', icon: <Clock className="h-4 w-4" />, nextPhase: 'judging' },
    judging: { label: 'Judging', icon: <CheckCircle className="h-4 w-4" />, nextPhase: 'past' },
    past: { label: 'Completed', icon: <Award className="h-4 w-4" /> },
  };

  const handlePhaseSelect = (phase: PhaseStatus) => {
    if (phase === safeCurrentPhase) {
      toast({ title: 'No Change', description: 'Hackathon is already in this phase.' });
      return;
    }
    setError(null);
    setTargetPhase(phase);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetPhase || updatePhase.isPending) return;
    
    try {
      await updatePhase.mutateAsync({ 
        hackathonId, 
        status: targetPhase 
      });
      
      setIsDialogOpen(false);
      onPhaseChanged();
      setError(null);
    } catch (err: any) {
      console.error('Phase update failed:', err);
      setError(err.message || 'Failed to update phase');
      // Don't close the dialog, let the user retry or cancel
    }
  };

  const handleCloseDialog = () => {
    if (!updatePhase.isPending) {
      setIsDialogOpen(false);
      setError(null);
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
          {Object.entries(phaseOptions).map(([phase, { label, icon }]) => (
            <DropdownMenuItem key={phase} onClick={() => handlePhaseSelect(phase as PhaseStatus)}>
              {icon}
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Phase Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the phase from "{phaseOptions[safeCurrentPhase].label}" to "{targetPhase ? phaseOptions[targetPhase].label : ''}"?
              {targetPhase === 'active' && ' This will start the hackathon and allow project submissions.'}
              {targetPhase === 'judging' && ' This will close submissions and start the judging period.'}
              {targetPhase === 'past' && ' This will finalize the hackathon and archive it.'}
              
              {error && (
                <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-md">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={updatePhase.isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={updatePhase.isPending}>
              {updatePhase.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HackathonPhaseManager;
