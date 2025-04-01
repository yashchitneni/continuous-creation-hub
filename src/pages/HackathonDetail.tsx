
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  useHackathon, 
  useIsHackathonParticipant, 
  useJoinHackathon, 
  useHackathonParticipantCount,
  useDeleteHackathon,
  HackathonStatus
} from '@/hooks/useHackathons';
import { useHackathonProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import HackathonHeader from '@/components/hackathon/HackathonHeader';
import ProjectsList from '@/components/hackathon/ProjectsList';
import SubmitProjectForm from '@/components/hackathon/SubmitProjectForm';
import { toast } from '@/hooks/use-toast';

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    
    if (isParticipant) {
      toast({
        title: "Already joined",
        description: "You are already a participant in this hackathon.",
        variant: "destructive",
      });
      return;
    }
    
    await joinHackathon.mutateAsync({ hackathonId: hackathon.id, userId: user.id });
  };
  
  const handleDeleteHackathon = async () => {
    if (!user || hackathon.creator_id !== user.id) return;
    
    // Check if the hackathon has participants
    if (participantCount > 0) {
      toast({
        title: "Cannot delete hackathon",
        description: "This hackathon has participants and cannot be deleted. Please remove all participants first.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      return;
    }
    
    try {
      await deleteHackathon.mutateAsync(hackathon.id);
      setIsDeleteDialogOpen(false);
      navigate('/hackathons');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
    }
  };
  
  // Cast the status to HackathonStatus to fix the type error
  const typedHackathon = {
    ...hackathon,
    status: hackathon.status as HackathonStatus
  };
  
  const isCreator = user?.id === hackathon.creator_id;
  
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
            hackathon={typedHackathon}
            participantCount={participantCount}
            isParticipant={isParticipant}
            user={user}
            onJoinHackathon={handleJoinHackathon}
            onDeleteHackathon={() => setIsDeleteDialogOpen(true)}
            isJoinHackathonPending={joinHackathon.isPending}
            isSubmitDialogOpen={isSubmitDialogOpen}
            setIsSubmitDialogOpen={setIsSubmitDialogOpen}
          />
          
          {/* Projects List Component */}
          <ProjectsList 
            projects={projects}
            hackathon={typedHackathon}
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
          
          {/* Delete Hackathon Dialog */}
          {isCreator && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Delete Hackathon</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this hackathon? This action cannot be undone.
                    {participantCount > 0 && (
                      <p className="mt-2 text-red-500">
                        Warning: This hackathon has participants. You must remove all participants before deleting.
                      </p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteHackathon}
                    disabled={deleteHackathon.isPending || participantCount > 0}
                  >
                    {deleteHackathon.isPending ? 'Deleting...' : 'Delete Hackathon'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default HackathonDetail;
