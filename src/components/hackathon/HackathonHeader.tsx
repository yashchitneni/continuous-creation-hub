
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MoreVertical, Edit, Trash2, PlusCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHackathonParticipants } from '@/hooks/useHackathons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateHackathonPhase } from '@/hooks/useUpdateHackathonPhase';
import { HackathonStatus } from '@/hooks/useHackathons';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tag } from '@/components/ui/tag';
import { toast } from '@/hooks/use-toast';

interface HackathonHeaderProps {
  hackathon: any;
  participantCount: number;
  isParticipant: boolean;
  user: any;
  onJoinHackathon: () => void;
  onDeleteHackathon: () => void;
  isJoinHackathonPending: boolean;
  isSubmitDialogOpen: boolean;
  setIsSubmitDialogOpen: (isOpen: boolean) => void;
  updatePhaseLoading?: boolean;
}

const HackathonHeader: React.FC<HackathonHeaderProps> = ({
  hackathon,
  participantCount,
  isParticipant,
  user,
  onJoinHackathon,
  onDeleteHackathon,
  isJoinHackathonPending,
  isSubmitDialogOpen,
  setIsSubmitDialogOpen,
  updatePhaseLoading = false
}) => {
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [isPhaseConfirmOpen, setIsPhaseConfirmOpen] = useState(false);
  const [targetPhase, setTargetPhase] = useState<HackathonStatus | null>(null);
  const { data: participants = [], isLoading: loadingParticipants } = useHackathonParticipants(hackathon.id);
  const updateHackathonPhase = useUpdateHackathonPhase();
  
  const [currentStatus, setCurrentStatus] = useState<string>(hackathon.status);
  
  useEffect(() => {
    if (hackathon?.status !== currentStatus) {
      console.log(`HackathonHeader: Status changed from ${currentStatus} to ${hackathon.status}`);
      setCurrentStatus(hackathon.status);
    }
  }, [hackathon, currentStatus]);
  
  useEffect(() => {
    if ((updateHackathonPhase.isSuccess || updateHackathonPhase.isError) && isPhaseConfirmOpen) {
      console.log('Mutation completed, closing modal. Success:', updateHackathonPhase.isSuccess, 'Error:', updateHackathonPhase.isError);
      setIsPhaseConfirmOpen(false);
      setTargetPhase(null);
    }
  }, [updateHackathonPhase.isSuccess, updateHackathonPhase.isError, isPhaseConfirmOpen]);
  
  useEffect(() => {
    console.log("HackathonHeader received hackathon:", hackathon);
  }, [hackathon]);
  
  const isUpcomingHackathon = hackathon.status === 'upcoming';
  const isActiveHackathon = hackathon.status === 'active';
  const isJudgingHackathon = hackathon.status === 'judging';
  const isPastHackathon = hackathon.status === 'past';
  
  const isCreator = user?.id === hackathon.creator_id;
  console.log("User ID:", user?.id);
  console.log("Creator ID:", hackathon.creator_id);
  console.log("Is creator:", isCreator);
  console.log("Current hackathon status:", hackathon.status);

  const getStatusBadgeVariant = () => {
    switch (hackathon.status) {
      case 'upcoming':
        return 'secondary';
      case 'active':
        return 'default'; 
      case 'judging':
        return 'destructive'; 
      case 'past':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getConfirmationMessage = () => {
    switch (targetPhase) {
      case 'active':
        return "This will open the hackathon for participants to join and submit projects.";
      case 'judging':
        return "This will close project submissions and open the voting phase. Participants will be able to vote on projects.";
      case 'past':
        return "This will mark the hackathon as completed. Voting will be closed and results will be finalized.";
      case 'upcoming':
        return "This will reset the hackathon to upcoming status. All submissions and voting may be affected.";
      default:
        return "Are you sure you want to change the hackathon phase?";
    }
  };

  const handlePhaseChange = (phase: HackathonStatus) => {
    console.log("Attempting to change phase to:", phase);
    console.log("Current phase:", hackathon.status);
    
    if (phase === hackathon.status) {
      toast({
        title: "No change needed",
        description: `The hackathon is already in ${phase} phase.`,
      });
      return;
    }
    
    setTargetPhase(phase);
    setIsPhaseConfirmOpen(true);
  };

  const confirmPhaseChange = async () => {
    console.log('confirmPhaseChange called with targetPhase:', targetPhase);
    if (!targetPhase) {
      console.log('No target phase, exiting');
      return;
    }
    
    console.log("Confirming phase change to:", targetPhase);
    console.log("From current phase:", hackathon.status);
    
    try {
      if (!hackathon.id) {
        console.error("Missing hackathon ID");
        toast({
          title: "Error",
          description: "Missing hackathon ID",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Calling mutateAsync with hackathonId:', hackathon.id, 'and status:', targetPhase);
      await updateHackathonPhase.mutateAsync({
        hackathonId: hackathon.id,
        status: targetPhase
      });
      
      console.log('Mutation completed successfully');
    } catch (error) {
      console.error('Error confirming phase change:', error);
    }
  };

  const renderManagePhaseButton = () => {
    if (!isCreator) {
      console.log("Not rendering Manage Phase button because user is not creator");
      return null;
    }
    
    console.log("Rendering Manage Phase button for creator");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={updatePhaseLoading || updateHackathonPhase.isPending}
          >
            <Clock className="h-4 w-4" />
            {updateHackathonPhase.isPending ? 'Updating Phase...' : 'Manage Phase'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Change Hackathon Phase</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {hackathon.status !== 'upcoming' && (
            <DropdownMenuItem 
              onClick={() => handlePhaseChange('upcoming')}
              disabled={hackathon.status === 'upcoming' || updateHackathonPhase.isPending || updatePhaseLoading}
            >
              Mark as Upcoming
            </DropdownMenuItem>
          )}
          {hackathon.status !== 'active' && (
            <DropdownMenuItem 
              onClick={() => handlePhaseChange('active')}
              disabled={hackathon.status === 'active' || updateHackathonPhase.isPending || updatePhaseLoading}
            >
              Start Hackathon (Active)
            </DropdownMenuItem>
          )}
          {hackathon.status !== 'judging' && hackathon.status === 'active' && (
            <DropdownMenuItem 
              onClick={() => handlePhaseChange('judging')}
              disabled={hackathon.status === 'judging' || updateHackathonPhase.isPending || updatePhaseLoading}
            >
              Move to Judging
            </DropdownMenuItem>
          )}
          {hackathon.status !== 'past' && hackathon.status === 'judging' && (
            <DropdownMenuItem 
              onClick={() => handlePhaseChange('past')}
              disabled={hackathon.status === 'past' || updateHackathonPhase.isPending || updatePhaseLoading}
            >
              Mark as Past
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="mb-8">
      <div className="md:flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold">{hackathon.title}</h2>
            <Badge variant={getStatusBadgeVariant()} className="capitalize ml-2">
              {hackathon.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{hackathon.description}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {renderManagePhaseButton()}
          
          {isCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  <Edit className="mr-2 h-4 w-4" /> Edit (Coming Soon)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDeleteHackathon}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <div className="flex items-center gap-2">
            {user && !isParticipant && isActiveHackathon && (
              <Button onClick={onJoinHackathon} disabled={isJoinHackathonPending}>
                {isJoinHackathonPending ? 'Joining...' : 'Join Hackathon'}
              </Button>
            )}
            
            {user && isParticipant && isActiveHackathon && (
              <Button onClick={() => setIsSubmitDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit Project
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}</span>
        </div>
        <button 
          className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer" 
          onClick={() => setIsParticipantsDialogOpen(true)}
        >
          <Users className="w-4 h-4" />
          <span>{participantCount} Participants</span>
        </button>
      </div>

      <Dialog open={isParticipantsDialogOpen} onOpenChange={setIsParticipantsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hackathon Participants</DialogTitle>
            <DialogDescription>
              These are the participants currently joined in the hackathon.
            </DialogDescription>
          </DialogHeader>
          
          {loadingParticipants ? (
            <div className="py-4 text-center">Loading participants...</div>
          ) : participants.length === 0 ? (
            <div className="py-4 text-center">No participants yet.</div>
          ) : (
            <div className="py-4">
              <div className="space-y-4">
                {participants.map((participant: any) => (
                  <Link 
                    key={participant.user_id} 
                    to={`/profile/${participant.users?.username || participant.user_id}`}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={participant.users?.avatar_url} />
                      <AvatarFallback>
                        {participant.users?.username?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{participant.users?.username || 'Anonymous'}</div>
                      <div className="text-sm text-muted-foreground">Joined {new Date(participant.created_at).toLocaleDateString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={isPhaseConfirmOpen} 
        onOpenChange={(open) => {
          console.log('Modal open state changing to:', open);
          if (!updateHackathonPhase.isPending) {
            setIsPhaseConfirmOpen(open);
          } else {
            console.log('Preventing modal close during mutation');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Hackathon Phase</AlertDialogTitle>
            <AlertDialogDescription>
              {getConfirmationMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateHackathonPhase.isPending}>Cancel</AlertDialogCancel>
            <Button 
              onClick={() => {
                console.log('Confirm button clicked');
                confirmPhaseChange();
              }}
              disabled={updateHackathonPhase.isPending}
              className={updateHackathonPhase.isPending ? "opacity-70" : ""}
            >
              {updateHackathonPhase.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HackathonHeader;
