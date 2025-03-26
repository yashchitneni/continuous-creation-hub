
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HackCard from '@/components/showcase/HackCard';

const TrendingSection = () => {
  // Mock data for trending hacks
  const trendingHacks = [
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
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending Projects</h2>
            <p className="text-muted-foreground max-w-xl">
              The most popular projects this week as voted by the community
            </p>
          </div>
          
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link to="/showcase" className="inline-flex items-center">
              View All Projects <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingHacks.map((hack) => (
            <HackCard key={hack.id} {...hack} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
