
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HackathonStatus } from '@/hooks/useHackathons';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { Calendar, Users, Trash2 } from 'lucide-react';
import PhaseManager from './PhaseManager';

interface HackathonHeaderProps {
  hackathon: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: HackathonStatus;
    creator_id: string | null;
  };
  participantCount: number;
  isParticipant: boolean;
  user: User | null;
  onJoinHackathon: () => void;
  onDeleteHackathon: () => void;
  isJoinHackathonPending: boolean;
  isSubmitDialogOpen: boolean;
  setIsSubmitDialogOpen: (isOpen: boolean) => void;
  updatePhaseLoading: boolean;
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
}) => {
  const isCreator = user?.id === hackathon.creator_id;
  
  // Ensure the status is one of the valid values
  const validStatuses: HackathonStatus[] = ['upcoming', 'active', 'judging', 'past'];
  const safeStatus: HackathonStatus = validStatuses.includes(hackathon.status as HackathonStatus) 
    ? hackathon.status as HackathonStatus 
    : 'upcoming';
  
  const getStatusBadgeVariant = () => {
    switch (safeStatus) {
      case 'upcoming': return 'outline';
      case 'active': return 'default';
      case 'judging': return 'secondary';
      case 'past': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusLabel = () => {
    switch (safeStatus) {
      case 'upcoming': return 'Upcoming';
      case 'active': return 'Active';
      case 'judging': return 'Judging';
      case 'past': return 'Completed';
      default: return 'Unknown';
    }
  };
  
  const canSubmitProject = isParticipant && safeStatus === 'active';

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={getStatusBadgeVariant()}>
              {getStatusLabel()}
            </Badge>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{participantCount} Participants</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Phase Manager (for creator only) */}
          <PhaseManager 
            hackathon={{
              id: hackathon.id,
              status: safeStatus
            }}
            isCreator={isCreator} 
          />
          
          {/* Join Hackathon Button (for non-participants) */}
          {user && !isParticipant && safeStatus !== 'past' && (
            <Button onClick={onJoinHackathon} disabled={isJoinHackathonPending}>
              {isJoinHackathonPending ? 'Joining...' : 'Join Hackathon'}
            </Button>
          )}
          
          {/* Submit Project Button (for participants during active phase) */}
          {canSubmitProject && (
            <Button 
              variant={isParticipant ? "default" : "outline"}
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit Project
            </Button>
          )}
          
          {/* Delete Hackathon Button (for creator only) */}
          {isCreator && (
            <Button 
              variant="outline" 
              onClick={onDeleteHackathon}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-muted-foreground whitespace-pre-line">
          {hackathon.description}
        </p>
      </div>
    </div>
  );
};

export default HackathonHeader;
