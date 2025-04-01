
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  email?: string;
  avatarUrl?: string;
  isOwnProfile: boolean;
  onSignOut: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  avatarUrl,
  isOwnProfile,
  onSignOut
}) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-jungle/30 to-cambridge/30">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-24">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background rounded-full">
            <AvatarImage src={avatarUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow mt-4 md:mt-24">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold">{username}</h1>
                <p className="text-muted-foreground">{email}</p>
              </div>
              
              {isOwnProfile && (
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={onSignOut}>
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
