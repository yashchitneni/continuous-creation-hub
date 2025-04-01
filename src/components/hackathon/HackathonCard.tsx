
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Users, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useHackathonParticipantCount, useIsHackathonParticipant, useJoinHackathon } from '@/hooks/useHackathons';

interface HackathonCardProps {
  hackathon: any;
  isHomePage?: boolean;
}

const HackathonCard = ({ hackathon, isHomePage = false }: HackathonCardProps) => {
  const { user } = useAuth();
  const { data: participantCount = 0 } = useHackathonParticipantCount(hackathon.id);
  const { data: isParticipant = false } = useIsHackathonParticipant(hackathon.id, user?.id);
  const joinHackathon = useJoinHackathon();
  
  const isActive = hackathon.status === 'active';
  
  const handleJoinHackathon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !hackathon.id || isParticipant) return;
    
    await joinHackathon.mutateAsync({
      hackathonId: hackathon.id,
      userId: user.id
    });
  };
  
  const getStatusBadgeVariant = () => {
    switch (hackathon.status) {
      case 'upcoming':
        return 'secondary';
      case 'active':
        return 'default'; // Using default instead of success
      case 'judging':
        return 'destructive'; // Using destructive instead of warning
      case 'past':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  return (
    <div className={`glassmorphism rounded-xl p-6 flex flex-col ${isHomePage ? 'h-full' : ''} hover-scale group`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold group-hover:text-jungle transition-colors">
          <Link to={`/hackathons/${hackathon.id}`} className="block">
            {hackathon.title}
          </Link>
        </h3>
        <Badge variant={getStatusBadgeVariant()} className="capitalize">
          {hackathon.status}
        </Badge>
      </div>
      
      <p className="text-muted-foreground line-clamp-2 mb-4">
        {hackathon.description}
      </p>
      
      <div className="flex items-center justify-between mb-4 mt-auto">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participantCount} participants</span>
        </div>
      </div>
      
      <div className="space-y-2 mt-auto">
        <Link to={`/hackathons/${hackathon.id}`}>
          <Button className="w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        
        {user && isActive && !isParticipant && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleJoinHackathon}
            disabled={joinHackathon.isPending}
          >
            {joinHackathon.isPending ? 'Joining...' : 'Join Hackathon'}
          </Button>
        )}
        
        {user && isParticipant && (
          <div className="w-full py-2 flex justify-center items-center text-sm text-muted-foreground">
            <Check className="h-4 w-4 mr-1 text-green-500" /> 
            You've joined this hackathon
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonCard;
