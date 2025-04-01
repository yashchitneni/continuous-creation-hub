
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface ProjectsListProps {
  projects: any[];
  hackathon: any;
  isParticipant: boolean;
  user: any;
  loadingProjects: boolean;
  onJoinHackathon: () => void;
  setIsSubmitDialogOpen: (isOpen: boolean) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  hackathon,
  isParticipant,
  user,
  loadingProjects,
  onJoinHackathon,
  setIsSubmitDialogOpen
}) => {
  const isUpcomingHackathon = hackathon.status === 'upcoming';
  const isActiveHackathon = hackathon.status === 'active';
  const isJudgingHackathon = hackathon.status === 'judging';
  const isPastHackathon = hackathon.status === 'past';
  
  // Sort projects by total score for judging and past hackathons
  let sortedProjects = [...projects];
  if (isJudgingHackathon || isPastHackathon) {
    sortedProjects.sort((a, b) => {
      const aScore = a.vote_count || 0;
      const bScore = b.vote_count || 0;
      return bScore - aScore;
    });
  }
  
  // Find the winner (project with the most votes)
  const winnerProject = (isJudgingHackathon || isPastHackathon) && sortedProjects.length > 0 
    ? sortedProjects[0] 
    : null;

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {isPastHackathon 
            ? 'Submitted Projects' 
            : isJudgingHackathon
              ? 'Projects Under Judging'
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
                <Button onClick={onJoinHackathon}>
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
          {/* Winner Section - Only show for past or judging hackathons with projects */}
          {(isPastHackathon || isJudgingHackathon) && winnerProject && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span>{isPastHackathon ? 'Winning Project' : 'Current Leader'}</span>
              </h3>
              
              <div className="grid grid-cols-1">
                <ProjectCard
                  project={winnerProject}
                  isParticipant={isParticipant}
                  hackathonStatus={hackathon.status}
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
              {sortedProjects.map((project, index) => (
                // Skip showing the winner again in the grid
                ((isPastHackathon || isJudgingHackathon) && index === 0) ? null : (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isParticipant={isParticipant}
                    hackathonStatus={hackathon.status}
                    currentUserId={user?.id}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
