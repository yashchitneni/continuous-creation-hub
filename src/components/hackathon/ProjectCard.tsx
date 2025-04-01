
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Award, Star } from 'lucide-react';
import { useVoteForProject, useHasVoted, useProjectScores } from '@/hooks/useProjects';

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
  const voteForProject = useVoteForProject();
  const { data: hasVoted } = useHasVoted(project.id, currentUserId);
  const { data: projectScores } = useProjectScores(project.id);
  
  const isJudgingPhase = hackathonStatus === 'judging';
  const isPastPhase = hackathonStatus === 'past';
  const canVote = (isJudgingPhase || isPastPhase) && isParticipant && currentUserId;
  
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
        
        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
          <div className="flex flex-wrap gap-4">
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
          </div>
          
          <div className="flex items-center gap-3">
            {projectScores && projectScores.vote_count > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{projectScores.total_score.toFixed(1)}</span>
              </div>
            )}
            
            {(isJudgingPhase || isPastPhase) && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/hackathons/${project.hackathon_id}/projects/${project.id}`}>
                  {isPastPhase ? 'View Ratings' : (hasVoted ? 'Edit Rating' : 'Rate Project')}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
