
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useUserProjects } from '@/hooks/useProjects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag } from '@/components/ui/tag';
import { Calendar, Link as LinkIcon, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { data: userProjects = [], isLoading: loadingProjects } = useUserProjects(user?.id);
  
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading profile...
        </div>
      </PageLayout>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Get username from user metadata
  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  
  return (
    <PageLayout>
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-jungle/30 to-cambridge/30">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-24">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background rounded-full">
              <AvatarImage src={user.user_metadata?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow mt-4 md:mt-24">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <section className="w-full py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathons Joined</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-6">
              {loadingProjects ? (
                <div className="text-center py-10">Loading projects...</div>
              ) : userProjects.length === 0 ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold mb-4">You haven't submitted any projects yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Join a hackathon and submit a project to showcase your skills
                  </p>
                  <Button asChild>
                    <Link to="/hackathons">Browse Hackathons</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProjects.map((project: any) => (
                    <div key={project.id} className="glassmorphism rounded-xl overflow-hidden group relative">
                      <div className="relative h-48">
                        <img 
                          src={project.image_url || 'https://placehold.co/600x400?text=No+Image'} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 z-10 bg-muted/80 backdrop-blur-sm text-xs py-1 px-2 rounded-full">
                          {project.hackathon.status}
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
                          <Link to={`/hackathons/${project.hackathon_id}`}>
                            {project.title}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link to={`/hackathons/${project.hackathon_id}`} className="text-jungle hover:underline">
                            {project.hackathon.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hackathons" className="space-y-6">
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-4">Hackathon participation list coming soon</h2>
                <p className="text-muted-foreground mb-6">
                  We're working on this feature! Check back later.
                </p>
                <Button asChild>
                  <Link to="/hackathons">Browse Hackathons</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default Profile;
