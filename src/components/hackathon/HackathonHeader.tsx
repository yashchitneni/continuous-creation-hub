import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  setIsSubmitDialogOpen
}) => {
  const isUpcomingHackathon = hackathon.status === 'upcoming';
  const isActiveHackathon = hackathon.status === 'active';
  const isJudgingHackathon = hackathon.status === 'judging';
  const isPastHackathon = hackathon.status === 'past';
  
  const isCreator = user?.id === hackathon.creator_id;

  return (
    <div className="mb-8">
      <div className="md:flex items-start justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">{hackathon.title}</h2>
          <p className="text-muted-foreground">{hackathon.description}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {/* Actions for Creator */}
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
          
          {/* Status Indicators and Buttons */}
          <div className="flex items-center gap-2">
            {isUpcomingHackathon && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                Upcoming
              </span>
            )}
            {isActiveHackathon && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                Active
              </span>
            )}
            {isJudgingHackathon && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
                Judging
              </span>
            )}
            {isPastHackathon && (
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Past
              </span>
            )}
            
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
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{participantCount} Participants</span>
        </div>
      </div>
    </div>
  );
};

export default HackathonHeader;
