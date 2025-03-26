
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TestimonialProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  className?: string;
}

const Testimonial = ({ content, author, className }: TestimonialProps) => {
  return (
    <Card className={cn("border-none glassmorphism hover-scale", className)}>
      <CardContent className="p-6">
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-20"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
        </div>
        
        <p className="text-foreground mb-6">{content}</p>
        
        <div className="flex items-center gap-3">
          <img 
            src={author.avatarUrl} 
            alt={author.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-sm">{author.name}</p>
            <p className="text-xs text-muted-foreground">{author.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      content: "Just Keep Building helped me discover new tools I never knew existed. I participated in a mini-hackathon on AI tools and ended up building a solution that got me job offers!",
      author: {
        name: "Rachel Kim",
        role: "Full Stack Developer",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      }
    },
    {
      content: "The community feedback system helped me refine my project in ways I never expected. What started as a weekend hack is now a product with real users. Thank you JKB!",
      author: {
        name: "David Martinez",
        role: "Product Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      }
    },
    {
      content: "I love the 'Just Keep Building' philosophy. The constant cycle of learning and building has accelerated my growth as a developer more than anything else I've tried.",
      author: {
        name: "Aisha Patel",
        role: "UX Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground">
            Hear from members who have transformed their skills through continuous building
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
