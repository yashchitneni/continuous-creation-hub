
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface HackathonsListProps {
  hackathons: any[];
  isOwnProfile: boolean;
  username: string;
  isLoading: boolean;
}

const HackathonsList: React.FC<HackathonsListProps> = ({
  hackathons,
  isOwnProfile,
  username,
  isLoading
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading hackathons...</div>;
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">
          {isOwnProfile 
            ? "You haven't joined any hackathons yet" 
            : `${username} hasn't joined any hackathons yet`}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isOwnProfile 
            ? "Join a hackathon to showcase your skills and connect with other developers" 
            : "Check back later to see their hackathon participation"}
        </p>
        <Button asChild>
          <Link to="/hackathons">Browse Hackathons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map((hackathon: any) => (
        <div key={hackathon.id} className="glassmorphism rounded-xl p-6 hover-scale group">
          <div className="flex flex-col h-full">
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
              </div>
              
              <Link to={`/hackathons/${hackathon.id}`}>
                <Button className="w-full">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HackathonsList;
