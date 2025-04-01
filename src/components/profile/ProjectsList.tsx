
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';

interface ProjectsListProps {
  projects: any[];
  isOwnProfile: boolean;
  username: string;
  isLoading: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  isOwnProfile,
  username,
  isLoading
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">
          {isOwnProfile 
            ? "You haven't submitted any projects yet" 
            : `${username} hasn't submitted any projects yet`}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isOwnProfile 
            ? "Join a hackathon and submit a project to showcase your skills" 
            : "Check back later to see their submissions"}
        </p>
        <Button asChild>
          <Link to="/hackathons">Browse Hackathons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: any) => (
        <div key={project.id} className="glassmorphism rounded-xl overflow-hidden group relative">
          <div className="relative h-48">
            <img 
              src={project.image_url || 'https://placehold.co/600x400?text=No+Image'} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 z-10 bg-muted/80 backdrop-blur-sm text-xs py-1 px-2 rounded-full">
              {project.hackathon?.status}
            </div>
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
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to={`/hackathons/${project.hackathon_id}`} className="text-jungle hover:underline">
                {project.hackathon?.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
