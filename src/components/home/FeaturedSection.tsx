
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedHack from './FeaturedHack';

const FeaturedSection = () => {
  // Mock data for featured hack
  const featuredHack = {
    id: "1",
    title: "AI-Powered Task Management System",
    description: "A revolutionary task management platform that uses machine learning to prioritize and schedule your work based on your habits and peak productivity hours.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["AI", "Productivity", "Web App"],
    author: {
      name: "Alex Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Project</h2>
            <p className="text-muted-foreground max-w-xl">
              Discover the most impressive hack from our latest mini-hackathon
            </p>
          </div>
          
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link to="/showcase" className="inline-flex items-center">
              View All Projects <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        <FeaturedHack {...featuredHack} />
      </div>
    </section>
  );
};

export default FeaturedSection;
