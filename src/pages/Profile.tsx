
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag } from '@/components/ui/tag';
import HackCard from '@/components/showcase/HackCard';
import { Calendar, Link as LinkIcon, MapPin, MessageSquare, Twitter, Github, ExternalLink, Award, Users } from 'lucide-react';

const Profile = () => {
  // Mock data for user profile
  const profileData = {
    id: "user1",
    name: "Alex Johnson",
    username: "alexjohnson",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bio: "Full-stack developer specializing in AI and machine learning applications. I love building tools that make people's lives easier and more productive.",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    joinedDate: "May 2022",
    badges: [
      { name: "Hackathon Winner", icon: "trophy" },
      { name: "Top Contributor", icon: "star" },
      { name: "5+ Projects", icon: "layers" }
    ],
    skills: [
      "React", "Node.js", "TensorFlow", "Python", "UI/UX", "MongoDB",
      "AWS", "Docker", "TypeScript", "Machine Learning"
    ],
    socialLinks: {
      twitter: "https://twitter.com/alexj",
      github: "https://github.com/alexj",
      linkedin: "https://linkedin.com/in/alexj"
    },
    projects: [
      {
        id: "1",
        title: "AI-Powered Task Management System",
        description: "A revolutionary task management platform that uses machine learning to prioritize and schedule your work based on your habits and peak productivity hours.",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        tags: ["AI", "Productivity", "Web App"],
        author: {
          name: "Alex Johnson",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        likes: 126,
        comments: 42
      },
      {
        id: "7",
        title: "Visual Coding Assistant",
        description: "An AI-powered coding assistant that helps developers visualize complex algorithms and data structures in real-time as they code.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        tags: ["Developer Tools", "AI", "Visualization"],
        author: {
          name: "Alex Johnson",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        likes: 98,
        comments: 29
      },
      {
        id: "8",
        title: "Climate Change Visualization Dashboard",
        description: "An interactive dashboard that visualizes climate change data from various sources to help researchers and the public understand environmental trends.",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        tags: ["Data Visualization", "Climate", "Dashboard"],
        author: {
          name: "Alex Johnson",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        likes: 75,
        comments: 18
      }
    ],
    contributions: [
      {
        id: "9",
        title: "Collaborative Music Creation Platform",
        description: "A platform where musicians can collaborate in real-time to create, edit, and mix music tracks together regardless of their physical location.",
        imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        tags: ["Music", "Collaboration", "Real-time"],
        author: {
          name: "Jamal Foster",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
        },
        likes: 94,
        comments: 31,
        contribution: "Machine Learning Components"
      }
    ],
    coworkingSessions: [
      {
        id: "session1",
        date: "June 20, 2023",
        time: "2:00 PM - 4:00 PM",
        topic: "Machine Learning for Web Applications",
        participants: 5
      },
      {
        id: "session2",
        date: "June 27, 2023",
        time: "3:00 PM - 5:00 PM",
        topic: "Building Interactive Data Visualizations",
        participants: 3
      }
    ],
    hackathons: [
      {
        id: "hackathon1",
        name: "AI Tools Hackathon",
        date: "June 10-12, 2023",
        result: "Winner - Best AI Implementation"
      },
      {
        id: "hackathon2",
        name: "Climate Tech Challenge",
        date: "May 5-7, 2023",
        result: "2nd Place"
      },
      {
        id: "hackathon3",
        name: "Developer Tools Hackathon",
        date: "April 15-17, 2023",
        result: "Participant"
      }
    ]
  };

  return (
    <PageLayout>
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img 
            src={profileData.coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-24">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background rounded-full">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow mt-4 md:mt-24">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline">
                    <MessageSquare size={16} className="mr-2" />
                    Message
                  </Button>
                  <Button>
                    <Users size={16} className="mr-2" />
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <section className="w-full py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bio */}
              <div className="glassmorphism rounded-xl p-6">
                <p className="mb-6">{profileData.bio}</p>
                <div className="space-y-3">
                  {profileData.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={16} />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  
                  {profileData.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon size={16} />
                      <a 
                        href={profileData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-jungle hover:underline"
                      >
                        {profileData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Joined {profileData.joinedDate}</span>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {profileData.socialLinks.twitter && (
                    <a 
                      href={profileData.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-jungle transition-colors"
                    >
                      <Twitter size={18} />
                      <span className="sr-only">Twitter</span>
                    </a>
                  )}
                  
                  {profileData.socialLinks.github && (
                    <a 
                      href={profileData.socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-jungle transition-colors"
                    >
                      <Github size={18} />
                      <span className="sr-only">GitHub</span>
                    </a>
                  )}
                  
                  {profileData.socialLinks.linkedin && (
                    <a 
                      href={profileData.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-jungle transition-colors"
                    >
                      <ExternalLink size={18} />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Badges */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="font-medium mb-4">Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.badges.map((badge, index) => (
                    <div 
                      key={index}
                      className="inline-flex items-center gap-2 bg-muted p-2 rounded-lg text-sm"
                    >
                      <Award size={16} className="text-jungle" />
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills */}
              <div className="glassmorphism rounded-xl p-6">
                <h3 className="font-medium mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Tag key={index} variant="outline" size="sm">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
              
              {/* Co-working */}
              <div className="glassmorphism rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Co-working Sessions</h3>
                  <Button variant="outline" size="sm">Schedule</Button>
                </div>
                
                {profileData.coworkingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.coworkingSessions.map((session) => (
                      <div key={session.id} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">{session.topic}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{session.date}</span>
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Users size={12} />
                          <span>{session.participants} participants</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                )}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profileData.projects.map((project) => (
                      <HackCard key={project.id} {...project} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="contributions" className="space-y-6">
                  {profileData.contributions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.contributions.map((contribution) => (
                        <div key={contribution.id} className="relative">
                          <HackCard {...contribution} />
                          <div className="absolute top-4 right-4 bg-jungle text-white text-xs py-1 px-2 rounded-full">
                            {contribution.contribution}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No contributions yet</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="hackathons" className="space-y-6">
                  <div className="space-y-4">
                    {profileData.hackathons.map((hackathon) => (
                      <div 
                        key={hackathon.id}
                        className="glassmorphism rounded-xl p-6 flex flex-col md:flex-row justify-between hover-scale"
                      >
                        <div>
                          <h3 className="font-medium text-lg mb-2">
                            <Link 
                              to={`/hackathons/${hackathon.id}`}
                              className="hover:text-jungle transition-colors"
                            >
                              {hackathon.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">{hackathon.date}</p>
                        </div>
                        
                        {hackathon.result && (
                          <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center gap-1 text-sm">
                              {hackathon.result.includes("Winner") && (
                                <Award size={16} className="text-jungle" />
                              )}
                              {hackathon.result}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Profile;
