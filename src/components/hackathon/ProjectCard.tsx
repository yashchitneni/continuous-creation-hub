
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Award, Heart, MessageSquare } from 'lucide-react';
import { useVoteForProject } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: any;
  isParticipant: boolean;
  hackathonStatus: string;
  currentUserId?: string;
  isWinner?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isParticipant,
  hackathonStatus,
  currentUserId,
  isWinner = false
}) => {
  const isJudgingPhase = hackathonStatus === 'judging';
  const isPastHackathon = hackathonStatus === 'past';
  const canVote = isJudgingPhase && isParticipant && project.creator_id !== currentUserId;
  
  const voteForProject = useVoteForProject();
  
  const handleVote = async () => {
    if (!currentUserId || !canVote) return;
    
    await voteForProject.mutateAsync({
      projectId: project.id,
      userId: currentUserId,
      storyScore: 5,
      styleScore: 5,
      functionScore: 5
    });
  };
  
  const hasVoted = project.votes?.some((vote: any) => vote.user_id === currentUserId);
  
  return (
    <div className={`glassmorphism rounded-xl overflow-hidden group relative ${isWinner ? 'ring-2 ring-yellow-400' : ''}`}>
      {isWinner && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs py-1 px-2 rounded-full flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span>Winner</span>
        </div>
      )}
      
      <div className="relative h-48">
        {project.image_url ? (
          <img 
            src={project.image_url || 'https://placehold.co/600x400?text=No+Image'} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags && project.tags.slice(0, 3).map((tag: string, index: number) => (
            <Tag key={index} variant={index === 0 ? 'primary' : 'outline'} size="sm">
              {tag}
            </Tag>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-jungle transition-colors">
          <Link to={`/hackathons/${project.hackathon_id}/projects/${project.id}`}>
            {project.title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link to={`/profile/${project.creator_id}`} className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={project.creator?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${project.creator?.username || 'User'}`} />
              <AvatarFallback>{(project.creator?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{project.creator?.username || 'User'}</span>
          </Link>
          
          {(isJudgingPhase || isPastHackathon) && (
            <div className="flex items-center gap-1 text-sm">
              <Heart className={`h-4 w-4 ${hasVoted ? 'fill-coral text-coral' : ''}`} />
              <span>{project.vote_count || 0}</span>
            </div>
          )}
        </div>
        
        {canVote && (
          <div className="mt-4">
            <Button 
              variant={hasVoted ? "outline" : "default"}
              className={`w-full ${hasVoted ? 'text-coral' : ''}`}
              onClick={handleVote}
              disabled={hasVoted || voteForProject.isPending}
            >
              <Heart className={`mr-2 h-4 w-4 ${hasVoted ? 'fill-coral' : ''}`} />
              {hasVoted ? 'Voted' : 'Vote for this project'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
