
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Calendar, Users } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HackathonStatus } from '@/hooks/useHackathons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHackathonParticipants } from '@/hooks/useProjects';

interface HackathonHeaderProps {
  hackathon: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: HackathonStatus;
  };
  participantCount: number;
  isParticipant: boolean;
  user: any;
  onJoinHackathon: () => void;
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
  isJoinHackathonPending,
  isSubmitDialogOpen,
  setIsSubmitDialogOpen
}) => {
  const isUpcomingHackathon = hackathon.status === 'upcoming';
  const isActiveHackathon = hackathon.status === 'active';
  const isJudgingHackathon = hackathon.status === 'judging';
  const isPastHackathon = hackathon.status === 'past';
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  
  const { data: participants = [] } = useHackathonParticipants(hackathon.id);

  return (
    <div className="mb-10 glassmorphism rounded-xl p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <div className="mb-2">
            <Tag 
              variant={
                isPastHackathon 
                  ? 'outline' 
                  : isActiveHackathon 
                    ? 'primary' 
                    : isJudgingHackathon
                      ? 'default'
                      : 'outline'
              }
            >
              {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
            </Tag>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
              </span>
            </div>
            
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setIsParticipantDialogOpen(true)}
            >
              <Users className="h-4 w-4" />
              <span>{participantCount} participants</span>
            </div>
          </div>
        </div>
        
        {user && !isParticipant && (isUpcomingHackathon || isActiveHackathon) && (
          <Button 
            onClick={onJoinHackathon}
            disabled={isJoinHackathonPending}
          >
            {isJoinHackathonPending ? 'Joining...' : 'Join Hackathon'}
          </Button>
        )}
        
        {user && isParticipant && isActiveHackathon && (
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button>Submit Project</Button>
            </DialogTrigger>
          </Dialog>
        )}
      </div>
      
      <div className="prose max-w-none">
        <p className="text-lg">{hackathon.description}</p>
      </div>

      {/* Participants Dialog */}
      <Dialog open={isParticipantDialogOpen} onOpenChange={setIsParticipantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hackathon Participants</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
            {participants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No participants yet</p>
            ) : (
              participants.map((participant: any) => (
                <Link 
                  key={participant.user_id}
                  to={`/profile/${participant.user_id}`}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={participant.users?.avatar_url} />
                    <AvatarFallback>
                      {participant.users?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.users?.username || 'Anonymous'}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HackathonHeader;
