
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useUserProjects } from '@/hooks/useProjects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag } from '@/components/ui/tag';
import { Calendar, Link as LinkIcon, MapPin, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// New hook to fetch user profile by ID
const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
};

// New hook to fetch user's hackathons
const useUserHackathons = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userHackathons', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('hackathon_participants')
        .select(`
          hackathon_id,
          hackathons:hackathons(*)
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      return data?.map(item => item.hackathons) || [];
    },
    enabled: !!userId
  });
};

const Profile = () => {
  const { id: profileId } = useParams();
  const { user, loading, signOut } = useAuth();
  
  // If no profileId is provided in URL, use the current user's ID (for /profile route)
  const targetUserId = profileId || user?.id;
  
  // Determine if we're viewing our own profile
  const isOwnProfile = user?.id === targetUserId;
  
  // Fetch user profile data
  const { data: profileData, isLoading: loadingProfile } = useUserProfile(targetUserId);
  
  // Fetch user projects
  const { data: userProjects = [], isLoading: loadingProjects } = useUserProjects(targetUserId);
  
  // Fetch user's hackathons
  const { data: userHackathons = [], isLoading: loadingHackathons } = useUserHackathons(targetUserId);
  
  if (loading || loadingProfile) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading profile...
        </div>
      </PageLayout>
    );
  }
  
  // If no profileId is provided (viewing /profile) and user is not logged in, redirect to auth
  if (!profileId && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile not found
  if (!profileData && !loading && !loadingProfile) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the profile you're looking for.
          </p>
          <Button asChild>
            <Link to="/hackathons">Browse Hackathons</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  // Get username from user metadata or profile data
  const username = profileData?.username || 'User';
  
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
              <AvatarImage src={profileData?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow mt-4 md:mt-24">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{username}</h1>
                  <p className="text-muted-foreground">{profileData?.email}</p>
                </div>
                
                {isOwnProfile && (
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </div>
                )}
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
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathons Joined</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-6">
              {loadingProjects ? (
                <div className="text-center py-10">Loading projects...</div>
              ) : userProjects.length === 0 ? (
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
              )}
            </TabsContent>
            
            <TabsContent value="hackathons" className="space-y-6">
              {loadingHackathons ? (
                <div className="text-center py-10">Loading hackathons...</div>
              ) : userHackathons.length === 0 ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold mb-4">
                    {isOwnProfile 
                      ? "You haven't joined any hackathons yet" 
                      : `${username} hasn't joined any hackathons yet`}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {isOwnProfile 
                      ? "Join a hackathon to showcase your skills and connect with other developers" 
                      : "Check back later to see their hackathon participation"}
                  </p>
                  <Button asChild>
                    <Link to="/hackathons">Browse Hackathons</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userHackathons.map((hackathon: any) => (
                    <div key={hackathon.id} className="glassmorphism rounded-xl p-6 hover-scale group">
                      <div className="flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-jungle transition-colors">
                          <Link to={`/hackathons/${hackathon.id}`} className="block">
                            {hackathon.title}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {hackathon.description}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          
                          <Link to={`/hackathons/${hackathon.id}`}>
                            <Button className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default Profile;
