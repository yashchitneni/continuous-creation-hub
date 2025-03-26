
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share, Code, ExternalLink, GitBranch } from 'lucide-react';

const HackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  
  // Mock data for the hack details
  const hackData = {
    id: id || "1",
    title: "AI-Powered Task Management System",
    description: "A revolutionary task management platform that uses machine learning to prioritize and schedule your work based on your habits and peak productivity hours.",
    longDescription: `
      This project was built during the AI Tools Hackathon with the goal of creating a more intelligent task management system. 
      
      The platform analyzes a user's work habits, productivity patterns, and task completion history to intelligently prioritize tasks and suggest optimal work schedules. It integrates with popular calendar apps and uses natural language processing to automatically categorize and tag tasks.
      
      Key features include:
      
      • ML-powered task prioritization based on urgency, importance, and user work patterns
      • Automatic scheduling optimization that suggests the best times to work on specific tasks
      • Natural language task creation and parsing
      • Integration with Google Calendar, Outlook, and other popular tools
      • Weekly productivity reports and insights
      • Collaborative team features for shared projects
      
      This hack was built using React, Node.js, and TensorFlow.js for the machine learning components. The UI is built with Tailwind CSS and the backend uses a MongoDB database.
    `,
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    tags: ["AI", "Productivity", "Web App", "Machine Learning", "Task Management", "React"],
    toolsUsed: ["React", "Node.js", "TensorFlow.js", "MongoDB", "Tailwind CSS"],
    demoUrl: "https://example.com/demo",
    repoUrl: "https://github.com/example/ai-task-manager",
    createdAt: "June 12, 2023",
    hackathon: {
      name: "AI Tools Hackathon",
      date: "June 10-12, 2023"
    },
    author: {
      id: "user1",
      name: "Alex Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      bio: "Full-stack developer specializing in AI and machine learning applications."
    },
    collaborators: [
      {
        id: "user2",
        name: "Sarah Miller",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      },
      {
        id: "user3",
        name: "Miguel Rodriguez",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
      }
    ],
    likes: 126,
    comments: [
      {
        id: "comment1",
        author: {
          name: "Olivia Chen",
          avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
        },
        content: "This is amazing! The prioritization algorithm works surprisingly well. I've been using it for a week and it's completely changed how I manage my day.",
        timestamp: "2 days ago"
      },
      {
        id: "comment2",
        author: {
          name: "James Wilson",
          avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
        },
        content: "Have you considered adding a pomodoro timer feature? I think it would complement the scheduling system really well.",
        timestamp: "1 day ago"
      }
    ]
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hack Header */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {hackData.tags.slice(0, 5).map((tag, index) => (
                  <Tag key={index} variant={index === 0 ? 'primary' : 'outline'} size="sm">
                    {tag}
                  </Tag>
                ))}
                {hackData.tags.length > 5 && (
                  <Tag variant="outline" size="sm">
                    +{hackData.tags.length - 5}
                  </Tag>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{hackData.title}</h1>
              
              <p className="text-muted-foreground mb-6">
                Built during <span className="text-jungle font-medium">{hackData.hackathon.name}</span> • {hackData.createdAt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link to={`/profile/${hackData.author.id}`} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={hackData.author.avatarUrl} alt={hackData.author.name} />
                    <AvatarFallback>{hackData.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{hackData.author.name}</p>
                    <p className="text-xs text-muted-foreground">Creator</p>
                  </div>
                </Link>
                
                {hackData.collaborators.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">with</span>
                    <div className="flex -space-x-2">
                      {hackData.collaborators.map((collaborator) => (
                        <Link 
                          key={collaborator.id} 
                          to={`/profile/${collaborator.id}`} 
                          className="relative z-0 hover:z-10 transition-transform hover:scale-110"
                        >
                          <Avatar className="border-2 border-background w-8 h-8">
                            <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                            <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="sr-only">{collaborator.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={isLiked ? 'default' : 'outline'} 
                onClick={toggleLike}
                className={isLiked ? 'bg-coral hover:bg-coral/90' : ''}
              >
                <Heart 
                  size={18} 
                  className={`mr-2 ${isLiked ? 'fill-white' : ''}`} 
                />
                {isLiked ? hackData.likes + 1 : hackData.likes}
              </Button>
              
              <Button variant="outline">
                <MessageSquare size={18} className="mr-2" />
                {hackData.comments.length}
              </Button>
              
              <Button variant="outline">
                <Share size={18} className="mr-2" />
                Share
              </Button>
              
              <Button variant="outline">
                <GitBranch size={18} className="mr-2" />
                Remix
              </Button>
            </div>
          </div>
          
          {/* Main Image */}
          <div className="mb-10 overflow-hidden rounded-xl">
            <img 
              src={hackData.imageUrl} 
              alt={hackData.title} 
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          {/* Content Tabs */}
          <Tabs defaultValue="overview" className="mb-16">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="comments">Comments ({hackData.comments.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-semibold mb-6">About the Project</h2>
                  <div className="text-foreground/90 space-y-4 mb-8">
                    {hackData.longDescription.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="glassmorphism rounded-xl p-6">
                    <h3 className="font-medium mb-4">Tools & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {hackData.toolsUsed.map((tool, index) => (
                        <Tag key={index} variant="outline" size="sm">
                          {tool}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glassmorphism rounded-xl p-6">
                    <h3 className="font-medium mb-4">Links</h3>
                    <div className="space-y-3">
                      {hackData.demoUrl && (
                        <a 
                          href={hackData.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/90 hover:text-jungle transition-colors"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      )}
                      
                      {hackData.repoUrl && (
                        <a 
                          href={hackData.repoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/90 hover:text-jungle transition-colors"
                        >
                          <Code size={16} />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="glassmorphism rounded-xl p-6">
                    <h3 className="font-medium mb-4">Hackathon</h3>
                    <Link 
                      to={`/hackathons/${hackData.hackathon.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-jungle hover:underline"
                    >
                      {hackData.hackathon.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {hackData.hackathon.date}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-full mb-4">
                  <img 
                    src={hackData.imageUrl} 
                    alt={`${hackData.title} main`}
                    className="w-full h-[400px] object-cover rounded-xl"
                  />
                </div>
                
                {hackData.additionalImages.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-xl">
                    <img 
                      src={image} 
                      alt={`${hackData.title} screenshot ${index + 1}`} 
                      className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comments">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Comments</h2>
                
                <div className="flex items-start gap-4 mb-8">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <textarea 
                      placeholder="Add a comment..."
                      className="w-full p-3 rounded-lg bg-muted/30 border-none resize-none focus:ring-1 focus:ring-jungle text-foreground/90 min-h-[100px]"
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                </div>
                
                {hackData.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4 py-6 border-t border-border">
                    <Avatar>
                      <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{comment.author.name}</p>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-foreground/90">{comment.content}</p>
                      <div className="mt-2">
                        <button className="text-sm text-muted-foreground hover:text-jungle transition-colors mr-4">
                          Reply
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-jungle transition-colors">
                          Like
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default HackDetail;
