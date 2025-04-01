
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useUserProjects } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserHackathons } from '@/hooks/useUserHackathons';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';

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
        </div>
      </PageLayout>
    );
  }
  
  // Get username from user metadata or profile data
  const username = profileData?.username || 'User';
  
  return (
    <PageLayout>
      <ProfileHeader 
        username={username}
        email={profileData?.email}
        avatarUrl={profileData?.avatar_url}
        isOwnProfile={isOwnProfile}
        onSignOut={signOut}
      />
      
      <ProfileContent 
        userProjects={userProjects}
        userHackathons={userHackathons}
        isLoading={{
          projects: loadingProjects,
          hackathons: loadingHackathons
        }}
        isOwnProfile={isOwnProfile}
        username={username}
      />
    </PageLayout>
  );
};

export default Profile;
