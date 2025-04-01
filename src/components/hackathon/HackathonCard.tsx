
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Users, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useHackathonParticipantCount, useIsHackathonParticipant } from '@/hooks/useHackathons';

interface HackathonCardProps {
  hackathon: any;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const { user } = useAuth();
  const { data: participantCount } = useHackathonParticipantCount(hackathon.id);
  const { data: isParticipant = false } = useIsHackathonParticipant(hackathon.id, user?.id);
  
  const isActive = hackathon.status === 'active';
  const isUpcoming = hackathon.status === 'upcoming';
  
  return (
    <div className="glassmorphism rounded-xl p-6 flex flex-col h-full hover-scale group">
      <h3 className="text-xl font-bold mb-2 group-hover:text-jungle transition-colors">
        <Link to={`/hackathons/${hackathon.id}`} className="block">
          {hackathon.title}
        </Link>
      </h3>
      
      <p className="text-muted-foreground line-clamp-2 mb-4">
        {hackathon.description}
      </p>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
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
        
        <div className="space-y-2">
          <Link to={`/hackathons/${hackathon.id}`}>
            <Button className="w-full">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          {user && (isUpcoming || isActive) && (
            <>
              {isParticipant ? (
                <div className="w-full py-2 flex justify-center items-center text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mr-1 text-green-500" /> 
                  You've joined this hackathon
                </div>
              ) : (
                <Link to={`/hackathons/${hackathon.id}`}>
                  <Button variant="outline" className="w-full">
                    Join Hackathon
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
