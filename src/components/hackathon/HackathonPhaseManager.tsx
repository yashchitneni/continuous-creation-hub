
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Clock, Calendar, CheckCircle, Award } from 'lucide-react';
import { useUpdateHackathonPhase, HackathonStatus } from '@/hooks/useUpdateHackathonPhase';
import { toast } from '@/hooks/use-toast';

interface HackathonPhaseManagerProps {
  hackathonId: string;
  currentPhase: HackathonStatus;
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
  const [targetPhase, setTargetPhase] = useState<HackathonStatus | null>(null);
  const updatePhase = useUpdateHackathonPhase();

  if (!isCreator) return null;

  const phaseOptions: Record<HackathonStatus, { label: string; icon: React.ReactNode; nextPhase?: HackathonStatus }> = {
    upcoming: { label: 'Upcoming', icon: <Calendar className="h-4 w-4" />, nextPhase: 'active' },
    active: { label: 'Active', icon: <Clock className="h-4 w-4" />, nextPhase: 'judging' },
    judging: { label: 'Judging', icon: <CheckCircle className="h-4 w-4" />, nextPhase: 'past' },
    past: { label: 'Completed', icon: <Award className="h-4 w-4" /> },
  };

  const handlePhaseSelect = (phase: HackathonStatus) => {
    if (phase === currentPhase) {
      toast({ title: 'No Change', description: 'Hackathon is already in this phase.' });
      return;
    }
    setTargetPhase(phase);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetPhase || updatePhase.isPending) return;
    try {
      await updatePhase.mutateAsync({ hackathonId, status: targetPhase });
      setIsDialogOpen(false);
      onPhaseChanged();
    } catch (error) {
      console.error('Phase update failed:', error);
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
            <DropdownMenuItem key={phase} onClick={() => handlePhaseSelect(phase as HackathonStatus)}>
              {icon}
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Phase Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the phase from "{phaseOptions[currentPhase].label}" to "{targetPhase ? phaseOptions[targetPhase].label : ''}"?
              {targetPhase === 'active' && ' This will start the hackathon and allow project submissions.'}
              {targetPhase === 'judging' && ' This will close submissions and start the judging period.'}
              {targetPhase === 'past' && ' This will finalize the hackathon and archive it.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={updatePhase.isPending}>
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
