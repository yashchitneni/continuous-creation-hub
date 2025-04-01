import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useHackathons, useHackathonParticipantCount, HackathonStatus, useCreateHackathon } from '@/hooks/useHackathons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Users, PlusCircle, ArrowRight } from 'lucide-react';

const HackathonCard = ({ hackathon }: { hackathon: any }) => {
  const { data: participantCount } = useHackathonParticipantCount(hackathon.id);
  
  return (
    <div className="glassmorphism rounded-xl p-6 hover-scale group">
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
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{participantCount} participants</span>
            </div>
          </div>
          
          <Link to={`/hackathons/${hackathon.id}`}>
            <Button className="w-full">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CreateHackathonForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { user } = useAuth();
  const createHackathon = useCreateHackathon();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    await createHackathon.mutateAsync({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      status: 'upcoming',
      creator_id: user.id
    });
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., Mobile App Hackathon"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what the hackathon is about..."
          required
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createHackathon.isPending}>
          {createHackathon.isPending ? 'Creating...' : 'Create Hackathon'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Hackathons = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HackathonStatus | 'all'>('upcoming');
  
  const { data: hackathons, isLoading, error } = useHackathons(activeTab === 'all' ? undefined : activeTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as HackathonStatus | 'all');
  };
  
  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold mb-2">Hackathons</h1>
              <p className="text-muted-foreground">
                Join hackathons, build projects, and showcase your skills
              </p>
            </div>
            
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Hackathon
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Hackathon</DialogTitle>
                    <DialogDescription>
                      Fill out the details to create a new hackathon for the community.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateHackathonForm onClose={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="judging">Judging</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-20">Loading hackathons...</div>
              ) : error ? (
                <div className="text-center py-20 text-red-500">
                  Error loading hackathons. Please try again.
                </div>
              ) : hackathons && hackathons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold mb-2">No {activeTab} hackathons found</h3>
                  {activeTab === 'upcoming' && user && (
                    <p className="mb-4">Why not create one for the community?</p>
                  )}
                  {activeTab === 'upcoming' && user && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Hackathon
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default Hackathons;
