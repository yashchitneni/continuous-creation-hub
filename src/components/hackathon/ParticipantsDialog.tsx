
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Participant {
  id: string;
  user_id: string;
  hackathon_id: string;
  joinedDate: string;
  users: {
    id: string;
    username: string;
    avatar_url?: string;
    email?: string;
  };
}

interface ParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  isLoading: boolean;
}

const ParticipantsDialog: React.FC<ParticipantsDialogProps> = ({
  open,
  onOpenChange,
  participants,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Hackathon Participants</DialogTitle>
          <DialogDescription>
            These are the participants currently joined in the hackathon.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading participants...</div>
        ) : participants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No participants have joined yet.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {participants.map((participant) => (
                <Link 
                  key={participant.id} 
                  to={`/profile/${participant.user_id}`}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.users?.avatar_url} alt={participant.users?.username} />
                    <AvatarFallback>
                      {participant.users?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{participant.users?.username || 'Anonymous'}</h4>
                    <p className="text-sm text-muted-foreground">
                      Joined {participant.joinedDate}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsDialog;
