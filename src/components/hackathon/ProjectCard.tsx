
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

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
  // Determine if the current user is the author of the project
  const isAuthor = currentUserId && project.user_id === currentUserId;
  
  return (
    <Card className={`h-full transition-all ${isWinner ? 'shadow-lg border-yellow-300 border-2' : ''}`}>
      <CardHeader className="relative p-4">
        {isWinner && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <Trophy className="h-3 w-3 text-yellow-500" />
            <span>{hackathonStatus === 'past' ? 'Winner' : 'Leading'}</span>
          </div>
        )}
        
        <div className="h-48 w-full overflow-hidden rounded-md mb-2">
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags && project.tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags && project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex justify-between items-center border-t">
        {(hackathonStatus === 'judging' || hackathonStatus === 'past') && (
          <span className="text-sm text-muted-foreground flex items-center">
            {project.vote_count || 0} votes
          </span>
        )}
        
        {isAuthor && (
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            Your Project
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
