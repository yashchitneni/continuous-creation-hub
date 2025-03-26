
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useHackathon, useIsHackathonParticipant, useJoinHackathon, useHackathonParticipantCount } from '@/hooks/useHackathons';
import { useHackathonProjects, useCreateProject, useVoteForProject, useHasVoted } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { ImageUpload } from '@/components/ui/image-upload';
import { Calendar, Users, Heart, Award, Github, ExternalLink, ArrowLeft } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  isParticipant: boolean;
  isPastHackathon: boolean;
  currentUserId?: string;
  isWinner?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isParticipant, 
  isPastHackathon, 
  currentUserId,
  isWinner = false
}) => {
  const voteForProject = useVoteForProject();
  const { data: hasVoted } = useHasVoted(project.id, currentUserId);
  
  const handleVote = async () => {
    if (!currentUserId || hasVoted) return;
    await voteForProject.mutateAsync({ projectId: project.id, userId: currentUserId });
  };
  
  return (
    <div className={`glassmorphism rounded-xl overflow-hidden group relative ${isWinner ? 'border-2 border-yellow-400' : ''}`}>
      {isWinner && (
        <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-xs py-1 px-2 rounded-full flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span>Winner</span>
        </div>
      )}
      
      <div className="relative h-48">
        <img 
          src={project.image_url || 'https://placehold.co/600x400?text=No+Image'} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags && project.tags.slice(0, 3).map((tag: string, index: number) => (
            <Tag key={index} variant={index === 0 ? 'primary' : 'outline'} size="sm">
              {tag}
            </Tag>
          ))}
          {project.tags && project.tags.length > 3 && (
            <Tag variant="outline" size="sm">+{project.tags.length - 3}</Tag>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-jungle transition-colors">
          <Link to={`/hackathons/${project.hackathon_id}/projects/${project.id}`}>
            {project.title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-auto">
          {project.github_link && (
            <a 
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-jungle transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Source</span>
            </a>
          )}
          
          {project.website_url && (
            <a 
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-jungle transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
          
          {isPastHackathon && (
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant={hasVoted ? 'default' : 'outline'}
                size="sm"
                onClick={handleVote}
                disabled={!isParticipant || !currentUserId || hasVoted || voteForProject.isPending}
                title={!isParticipant ? 'Only participants can vote' : (hasVoted ? 'You already voted' : 'Vote for this project')}
                className={hasVoted ? 'bg-coral hover:bg-coral/90' : ''}
              >
                <Heart 
                  size={16} 
                  className={`mr-1 ${hasVoted ? 'fill-white' : ''}`}
                />
                <span>{project.vote_count || 0}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubmitProjectForm = ({ hackathonId, userId, onClose }: { hackathonId: string, userId: string, onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tags, setTags] = useState('');
  
  const createProject = useCreateProject();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const tagArray = tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    await createProject.mutateAsync({
      title,
      description,
      image_url: imageUrl,
      tags: tagArray,
      github_link: githubLink,
      website_url: websiteUrl || null,
      hackathon_id: hackathonId,
      user_id: userId
    });
    
    onClose();
  };
  
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., AI-Powered Task Manager"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what your project does and the technologies used..."
          required
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Project Image</Label>
        <ImageUpload
          onUploadComplete={handleImageUpload}
          defaultImageUrl={imageUrl}
          uploadPath="project-images"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="githubLink">GitHub Repository URL</Label>
        <Input
          id="githubLink"
          type="url"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/yourusername/project"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Live Demo URL (Optional)</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://your-project-demo.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="E.g., React, AI, Mobile, Web App"
          required
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas, e.g., "React, TypeScript, AI"
        </p>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createProject.isPending}>
          {createProject.isPending ? 'Submitting...' : 'Submit Project'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  const { data: hackathon, isLoading: loadingHackathon } = useHackathon(id);
  const { data: isParticipant = false } = useIsHackathonParticipant(id, user?.id);
  const { data: participantCount = 0 } = useHackathonParticipantCount(id);
  const { data: projects = [], isLoading: loadingProjects } = useHackathonProjects(id);
  
  const joinHackathon = useJoinHackathon();
  
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
  
  const isPastHackathon = hackathon.status === 'past';
  const isUpcomingHackathon = hackathon.status === 'upcoming';
  const isActiveHackathon = hackathon.status === 'active';
  
  const handleJoinHackathon = async () => {
    if (!user) return;
    await joinHackathon.mutateAsync({ hackathonId: hackathon.id, userId: user.id });
  };
  
  // Find the winner (project with the most votes)
  const winnerProject = isPastHackathon && projects.length > 0 ? projects[0] : null;
  
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
          
          {/* Hackathon Header */}
          <div className="mb-10 glassmorphism rounded-xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <div className="mb-2">
                  <Tag 
                    variant={
                      isPastHackathon 
                        ? 'outline' 
                        : isActiveHackathon 
                          ? 'primary' 
                          : 'default'
                    }
                  >
                    {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                  </Tag>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{participantCount} participants</span>
                  </div>
                </div>
              </div>
              
              {user && !isParticipant && (isUpcomingHackathon || isActiveHackathon) && (
                <Button 
                  onClick={handleJoinHackathon}
                  disabled={joinHackathon.isPending}
                >
                  {joinHackathon.isPending ? 'Joining...' : 'Join Hackathon'}
                </Button>
              )}
              
              {user && isParticipant && isActiveHackathon && (
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Submit Project</Button>
                  </DialogTrigger>
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
            
            <div className="prose max-w-none">
              <p className="text-lg">{hackathon.description}</p>
            </div>
          </div>
          
          {/* Projects Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                {isPastHackathon 
                  ? 'Submitted Projects' 
                  : isActiveHackathon 
                    ? 'Projects In Progress' 
                    : 'No Projects Yet'}
              </h2>
              
              {user && isParticipant && isActiveHackathon && (
                <Button onClick={() => setIsSubmitDialogOpen(true)}>
                  Submit Your Project
                </Button>
              )}
            </div>
            
            {loadingProjects ? (
              <div className="text-center py-20">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="glassmorphism rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No projects submitted yet</h3>
                {isActiveHackathon ? (
                  <>
                    <p className="mb-6">Be the first to submit a project for this hackathon!</p>
                    {user && isParticipant ? (
                      <Button onClick={() => setIsSubmitDialogOpen(true)}>
                        Submit Your Project
                      </Button>
                    ) : user && !isParticipant ? (
                      <Button onClick={handleJoinHackathon}>
                        Join Hackathon to Submit
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/auth">Sign In to Join</Link>
                      </Button>
                    )}
                  </>
                ) : isUpcomingHackathon ? (
                  <p>Projects will be submitted once the hackathon starts.</p>
                ) : (
                  <p>No projects were submitted for this hackathon.</p>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Winner Section - Only show for past hackathons with projects */}
                {isPastHackathon && winnerProject && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span>Winning Project</span>
                    </h3>
                    
                    <div className="grid grid-cols-1">
                      <ProjectCard
                        project={winnerProject}
                        isParticipant={isParticipant}
                        isPastHackathon={isPastHackathon}
                        currentUserId={user?.id}
                        isWinner={true}
                      />
                    </div>
                  </div>
                )}
                
                {/* All Projects */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {isPastHackathon ? 'All Submissions' : 'Current Submissions'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                      // Skip showing the winner again in the grid
                      (isPastHackathon && index === 0) ? null : (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          isParticipant={isParticipant}
                          isPastHackathon={isPastHackathon}
                          currentUserId={user?.id}
                        />
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HackathonDetail;
