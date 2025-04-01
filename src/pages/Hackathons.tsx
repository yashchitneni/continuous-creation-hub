
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { HackathonStatus } from '@/hooks/useHackathons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import HackathonsList from '@/components/hackathon/HackathonsList';
import CreateHackathonForm from '@/components/hackathon/CreateHackathonForm';

const Hackathons = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HackathonStatus | 'all'>('upcoming');
  
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
              <HackathonsList 
                activeTab={activeTab} 
                onCreateClick={() => setIsCreateDialogOpen(true)} 
                userAuthenticated={!!user}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default Hackathons;
