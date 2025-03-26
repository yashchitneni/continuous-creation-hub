
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import { useAuth } from '@/context/AuthContext';
import { useHackathons, useJoinHackathon } from '@/hooks/useHackathons';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, ArrowRight, Users } from 'lucide-react';

const UpcomingHackathonCard = ({ hackathon }: { hackathon: any }) => {
  const { user } = useAuth();
  const joinHackathon = useJoinHackathon();
  
  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    await joinHackathon.mutateAsync({ hackathonId: hackathon.id, userId: user.id });
  };
  
  return (
    <div className="glassmorphism rounded-xl p-6 hover-scale group">
      <h3 className="text-xl font-bold mb-2 group-hover:text-jungle transition-colors">
        <Link to={`/hackathons/${hackathon.id}`} className="block">
          {hackathon.title}
        </Link>
      </h3>
      
      <p className="text-muted-foreground line-clamp-2 mb-4">
        {hackathon.description}
      </p>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={`/hackathons/${hackathon.id}`}>
            View Details
          </Link>
        </Button>
        
        {user ? (
          <Button variant="outline" onClick={handleJoin} disabled={joinHackathon.isPending}>
            {joinHackathon.isPending ? 'Joining...' : 'Join Hackathon'}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const { data: upcomingHackathons = [], isLoading } = useHackathons('upcoming');
  
  return (
    <PageLayout>
      <HeroSection />
      
      {/* Upcoming Hackathons Section */}
      <section className="w-full py-16 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Hackathons</h2>
              <p className="text-muted-foreground">
                Join a hackathon to build projects, learn new skills, and connect with the community
              </p>
            </div>
            
            <Button asChild>
              <Link to="/hackathons">
                View All Hackathons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">Loading hackathons...</div>
          ) : upcomingHackathons.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">No upcoming hackathons</h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new hackathons or browse past events
              </p>
              <Button asChild>
                <Link to="/hackathons">Browse All Hackathons</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHackathons.slice(0, 3).map((hackathon) => (
                <UpcomingHackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          )}
          
          {upcomingHackathons.length > 3 && (
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/hackathons">
                  View All Hackathons
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section for unauthenticated users */}
      {!user && (
        <section className="w-full py-16 px-4 sm:px-6 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start building?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign up to join hackathons, submit projects, and connect with other builders
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default Index;
