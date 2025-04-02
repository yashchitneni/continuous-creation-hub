import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  useHackathon, 
  useIsHackathonParticipant, 
  useJoinHackathon, 
  useHackathonParticipantCount,
  useHackathonParticipants,
  useDeleteHackathon,
  HackathonStatus
} from '@/hooks/useHackathons';
import { useHackathonProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Trash2, Users } from 'lucide-react';
import HackathonHeader from '@/components/hackathon/HackathonHeader';
import ProjectsList from '@/components/hackathon/ProjectsList';
import SubmitProjectForm from '@/components/hackathon/SubmitProjectForm';
import ParticipantsDialog from '@/components/hackathon/ParticipantsDialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateHackathonPhase } from '@/hooks/useUpdateHackathonPhase';

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  
  console.log("Hackathon ID from params:", id);
  
  const { 
    data: hackathon, 
    isLoading: loadingHackathon,
    refetch: refetchHackathon 
  } = useHackathon(id);
  
  const { data: isParticipant = false } = useIsHackathonParticipant(id, user?.id);
  const { data: participantCount = 0 } = useHackathonParticipantCount(id);
  const { data: participants = [], isLoading: loadingParticipants } = useHackathonParticipants(id);
  const { data: projects = [], isLoading: loadingProjects } = useHackathonProjects(id);
  const updateHackathonPhase = useUpdateHackathonPhase();
  
  console.log("Hackathon data:", hackathon);
  
  useEffect(() => {
    if (!id) return;
    
    const channel = supabase
      .channel(`hackathon-${id}-changes`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'hackathons',
        filter: `id=eq.${id}`
      }, (payload) => {
        console.log('Hackathon updated via real-time:', payload);
        refetchHackathon();
      })
      .subscribe((status) => {
        console.log('Supabase real-time subscription status:', status);
      });
    
    return () => {
      console.log('Cleaning up Supabase real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [id, refetchHackathon]);
  
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
  
  const ensureValidStatus = (status: string): HackathonStatus => {
    const validStatuses: HackathonStatus[] = ['upcoming', 'active', 'judging', 'past'];
    return validStatuses.includes(status as HackathonStatus) 
      ? (status as HackathonStatus) 
      : 'upcoming';
  };
  
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
    
    try {
      await deleteHackathon.mutateAsync(hackathon.id);
      setIsDeleteDialogOpen(false);
      navigate('/hackathons');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
    }
  };
  
  const typedHackathon = {
    ...hackathon,
    status: ensureValidStatus(hackathon?.status || 'upcoming'),
    creator_id: hackathon?.creator_id || null
  };
  
  console.log("Is creator:", user?.id === typedHackathon.creator_id);
  
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
            updatePhaseLoading={updateHackathonPhase.isPending}
          />
          
          <div className="mt-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setIsParticipantsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              View Participants ({participantCount})
            </Button>
          </div>
          
          <ProjectsList 
            projects={projects}
            hackathon={typedHackathon}
            isParticipant={isParticipant}
            user={user}
            loadingProjects={loadingProjects}
            onJoinHackathon={handleJoinHackathon}
            setIsSubmitDialogOpen={setIsSubmitDialogOpen}
          />
          
          {user && (
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
          
          <ParticipantsDialog 
            open={isParticipantsDialogOpen}
            onOpenChange={setIsParticipantsDialogOpen}
            participants={participants}
            isLoading={loadingParticipants}
          />
          
          {typedHackathon.creator_id && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Delete Hackathon</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this hackathon? This action cannot be undone.
                    {participantCount > 0 && (
                      <p className="mt-2 text-red-500">
                        Warning: This hackathon has participants. You cannot delete it until all participants are removed.
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
