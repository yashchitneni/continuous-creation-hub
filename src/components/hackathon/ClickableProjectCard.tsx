
import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';

interface ClickableProjectCardProps {
  project: any;
  isParticipant: boolean;
  hackathonStatus: string;
  currentUserId?: string;
  isWinner?: boolean;
}

const ClickableProjectCard: React.FC<ClickableProjectCardProps> = (props) => {
  const { project } = props;
  
  return (
    <Link 
      to={`/projects/${project.id}`} 
      className="block transition-transform hover:scale-[1.01] cursor-pointer"
    >
      <ProjectCard {...props} />
    </Link>
  );
};

export default ClickableProjectCard;
