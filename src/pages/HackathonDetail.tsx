
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  useHackathon, 
  useIsHackathonParticipant, 
  useJoinHackathon, 
  useHackathonParticipantCount,
  useDeleteHackathon
} from '@/hooks/useHackathons';
import { useHackathonProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import HackathonHeader from '@/components/hackathon/HackathonHeader';
import ProjectsList from '@/components/hackathon/ProjectsList';
import SubmitProjectForm from '@/components/hackathon/SubmitProjectForm';

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  const { data: hackathon, isLoading: loadingHackathon } = useHackathon(id);
  const { data: isParticipant = false } = useIsHackathonParticipant(id, user?.id);
  const { data: participantCount = 0 } = useHackathonParticipantCount(id);
  const { data: projects = [], isLoading: loadingProjects } = useHackathonProjects(id);
  
  const joinHackathon = useJoinHackathon();
  const deleteHackathon = useDeleteHackathon();
  
  if (loadingHackathon) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading hackathon details...
        </div>
      </PageLayout>
    );
  }
  
  if (!hackathon) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Hackathon Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The hackathon you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/hackathons">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hackathons
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const handleJoinHackathon = async () => {
    if (!user) return;
    await joinHackathon.mutateAsync({ hackathonId: hackathon.id, userId: user.id });
  };
  
  const handleDeleteHackathon = async () => {
    if (!user || hackathon.creator_id !== user.id) return;
    
    try {
      await deleteHackathon.mutateAsync(hackathon.id);
      navigate('/hackathons');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
    }
  };
  
  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2">
            <Button variant="ghost" asChild>
              <Link to="/hackathons">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hackathons
              </Link>
            </Button>
          </div>
          
          {/* Hackathon Header Component */}
          <HackathonHeader 
            hackathon={hackathon}
            participantCount={participantCount}
            isParticipant={isParticipant}
            user={user}
            onJoinHackathon={handleJoinHackathon}
            onDeleteHackathon={handleDeleteHackathon}
            isJoinHackathonPending={joinHackathon.isPending}
            isSubmitDialogOpen={isSubmitDialogOpen}
            setIsSubmitDialogOpen={setIsSubmitDialogOpen}
          />
          
          {/* Projects List Component */}
          <ProjectsList 
            projects={projects}
            hackathon={hackathon}
            isParticipant={isParticipant}
            user={user}
            loadingProjects={loadingProjects}
            onJoinHackathon={handleJoinHackathon}
            setIsSubmitDialogOpen={setIsSubmitDialogOpen}
          />
          
          {/* Submit Project Dialog */}
          {user && (
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Submit Your Project</DialogTitle>
                  <DialogDescription>
                    Share your project with the community. Make sure to include all the details and a link to your code.
                  </DialogDescription>
                </DialogHeader>
                <SubmitProjectForm 
                  hackathonId={hackathon.id} 
                  userId={user.id}
                  onClose={() => setIsSubmitDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default HackathonDetail;
