
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useIsHackathonParticipant, useJoinHackathon } from '@/hooks/useHackathons';

interface HackathonCardProps {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  theme: string;
  className?: string;
  accentColor: string;
}

const HackathonCard = ({
  id,
  title,
  date,
  duration,
  participants,
  theme,
  className,
  accentColor,
}: HackathonCardProps) => {
  const { user } = useAuth();
  const { data: isParticipant = false } = useIsHackathonParticipant(id, user?.id);
  const joinHackathon = useJoinHackathon();
  
  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    await joinHackathon.mutateAsync({ hackathonId: id, userId: user.id });
  };
  
  return (
    <Card 
      className={cn(
        "border-none hover-scale overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div className={`h-2 ${accentColor} w-full`} />
      <CardHeader className="pt-6">
        <div className="text-xs text-muted-foreground mb-2">{theme}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-2" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-2" />
            <span>{duration}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={16} className="mr-2" />
            <span>{participants} participants</span>
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link to={`/hackathons/${id}`}>View Details</Link>
            </Button>
            
            {user && !isParticipant ? (
              <Button onClick={handleJoin} disabled={joinHackathon.isPending} className="w-full">
                {joinHackathon.isPending ? 'Joining...' : 'Join Hackathon'}
              </Button>
            ) : user && isParticipant ? (
              <div className="w-full py-2 flex justify-center items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 mr-1 text-green-500" /> 
                You've joined this hackathon
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UpcomingHackathons = () => {
  // Mock data for upcoming hackathons
  const hackathons = [
    {
      id: "1",
      title: "AI Assistant Builders",
      date: "June 15-17, 2023",
      duration: "48 hours",
      participants: 342,
      theme: "Artificial Intelligence",
      accentColor: "bg-jungle",
    },
    {
      id: "2",
      title: "Web3 DApp Challenge",
      date: "June 22-24, 2023",
      duration: "48 hours",
      participants: 289,
      theme: "Blockchain & Web3",
      accentColor: "bg-coral",
    },
    {
      id: "3",
      title: "Sustainable Tech Solutions",
      date: "July 5-7, 2023",
      duration: "48 hours",
      participants: 201,
      theme: "Environmental Tech",
      accentColor: "bg-cambridge",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Hackathons</h2>
            <p className="text-muted-foreground max-w-xl">
              Join these upcoming mini-hackathons to learn new tools and showcase your skills
            </p>
          </div>
          
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link to="/hackathons" className="inline-flex items-center">
              View All Hackathons <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} {...hackathon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingHackathons;
