
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HackCard from '@/components/showcase/HackCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Search, SlidersHorizontal, Star, TrendingUp, Clock } from 'lucide-react';

const Showcase = () => {
  const [activeFilter, setActiveFilter] = useState<string>('trending');

  // Mock data for showcase hacks
  const hacks = [
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
      id: "2",
      title: "Voice-Controlled Smart Home Dashboard",
      description: "Control your entire smart home with natural voice commands. Integrates with popular smart home platforms and provides a beautiful visualization of your devices.",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      tags: ["IoT", "Voice AI", "Dashboard"],
      author: {
        name: "Sophia Chen",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
      },
      likes: 86,
      comments: 23
    },
    {
      id: "3",
      title: "Sustainable Fashion Finder",
      description: "An app that helps shoppers find sustainable fashion brands and secondhand alternatives to fast fashion, including environmental impact ratings.",
      imageUrl: "https://images.unsplash.com/photo-1542060748-10c28b62716f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      tags: ["Sustainability", "E-commerce", "Mobile App"],
      author: {
        name: "Marco Rivera",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
      },
      likes: 72,
      comments: 18
    },
    {
      id: "4",
      title: "Collaborative Music Creation Platform",
      description: "A platform where musicians can collaborate in real-time to create, edit, and mix music tracks together regardless of their physical location.",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      tags: ["Music", "Collaboration", "Real-time"],
      author: {
        name: "Jamal Foster",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
      },
      likes: 94,
      comments: 31
    },
    {
      id: "5",
      title: "AR Language Learning Experience",
      description: "An augmented reality app that helps users learn languages by overlaying translations and pronunciation guides on real-world objects.",
      imageUrl: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      tags: ["AR", "Education", "Mobile App"],
      author: {
        name: "Nina Patel",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      },
      likes: 65,
      comments: 14
    },
    {
      id: "6",
      title: "Mental Health Journaling App",
      description: "A privacy-focused journaling app that uses sentiment analysis to track mood patterns and provide personalized mental wellness insights.",
      imageUrl: "https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      tags: ["Mental Health", "Privacy", "AI"],
      author: {
        name: "Jordan Lee",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      },
      likes: 112,
      comments: 37
    },
  ];

  // Available technology tags for filtering
  const techTags = [
    "AI", "Web App", "Mobile App", "AR", "IoT", "Voice AI", "Blockchain", 
    "Real-time", "Collaboration", "Dashboard", "E-commerce", "Education", 
    "Sustainability", "Privacy", "Music"
  ];
  
  // Available categories for filtering
  const categories = [
    "Productivity", "Smart Home", "Education", "Entertainment", "Sustainability",
    "Health & Wellness", "Finance", "Social"
  ];

  return (
    <PageLayout>
      <section className="w-full py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Project Showcase</h1>
            <p className="text-muted-foreground text-lg">
              Discover innovative projects built by our community members during mini-hackathons
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="text"
                  placeholder="Search projects by name, tech, or creator"
                  className="pl-10 bg-muted/30 border-none h-11"
                />
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Advanced Filters
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Button 
                variant={activeFilter === 'trending' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('trending')}
                className="flex items-center gap-2"
                size="sm"
              >
                <TrendingUp size={16} />
                Trending
              </Button>
              
              <Button 
                variant={activeFilter === 'newest' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('newest')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Clock size={16} />
                Newest
              </Button>
              
              <Button 
                variant={activeFilter === 'popular' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('popular')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Star size={16} />
                Most Liked
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {techTags.slice(0, 8).map((tag, index) => (
                    <Tag key={index} variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">
                      {tag}
                    </Tag>
                  ))}
                  {techTags.length > 8 && (
                    <Tag variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">
                      +{techTags.length - 8} more
                    </Tag>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category, index) => (
                    <Tag key={index} variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">
                      {category}
                    </Tag>
                  ))}
                  {categories.length > 6 && (
                    <Tag variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">
                      +{categories.length - 6} more
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hacks.map((hack) => (
              <HackCard key={hack.id} {...hack} />
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Showcase;
