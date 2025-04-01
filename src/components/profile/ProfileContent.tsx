
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsList from './ProjectsList';
import HackathonsList from './HackathonsList';

interface ProfileContentProps {
  userProjects: any[];
  userHackathons: any[];
  isLoading: {
    projects: boolean;
    hackathons: boolean;
  };
  isOwnProfile: boolean;
  username: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  userProjects,
  userHackathons,
  isLoading,
  isOwnProfile,
  username
}) => {
  return (
    <section className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons Joined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <ProjectsList 
              projects={userProjects} 
              isOwnProfile={isOwnProfile} 
              username={username}
              isLoading={isLoading.projects}
            />
          </TabsContent>
          
          <TabsContent value="hackathons" className="space-y-6">
            <HackathonsList 
              hackathons={userHackathons} 
              isOwnProfile={isOwnProfile} 
              username={username}
              isLoading={isLoading.hackathons}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfileContent;
