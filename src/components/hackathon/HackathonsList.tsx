
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { HackathonStatus, useHackathons } from '@/hooks/useHackathons';
import HackathonCard from './HackathonCard';

interface HackathonsListProps {
  activeTab: HackathonStatus | 'all';
  onCreateClick: () => void;
  userAuthenticated: boolean;
}

const HackathonsList = ({ activeTab, onCreateClick, userAuthenticated }: HackathonsListProps) => {
  const { data: hackathons, isLoading, error } = useHackathons(activeTab === 'all' ? undefined : activeTab);

  if (isLoading) {
    return <div className="text-center py-20">Loading hackathons...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error loading hackathons. Please try again.
      </div>
    );
  }

  if (hackathons && hackathons.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <h3 className="text-xl font-semibold mb-2">No {activeTab} hackathons found</h3>
      {activeTab === 'upcoming' && userAuthenticated && (
        <p className="mb-4">Why not create one for the community?</p>
      )}
      {activeTab === 'upcoming' && userAuthenticated && (
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Hackathon
        </Button>
      )}
    </div>
  );
};

export default HackathonsList;
