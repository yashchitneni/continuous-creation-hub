
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HackCard from '@/components/showcase/HackCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Search, SlidersHorizontal, Star, TrendingUp, Clock } from 'lucide-react';
import { useAllProjects } from '@/hooks/useProjects';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const Showcase = () => {
  const [activeFilter, setActiveFilter] = useState<string>('trending');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: projects = [], isLoading, isError } = useAllProjects();

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
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsFilterOpen(true)}
              >
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
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-destructive">Error loading projects. Please try again later.</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No projects to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <HackCard 
                  key={project.id} 
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.image_url}
                  tags={project.tags}
                  author={{
                    name: project.user?.username || 'Anonymous',
                    avatarUrl: project.user?.avatar_url || ''
                  }}
                  likes={0} // We can add this later
                  comments={0} // We can add this later
                />
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {projects.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Advanced Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Select your filtering options to narrow down the projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Hackathon Status</h3>
              <div className="flex flex-wrap gap-2">
                <Tag variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">Active</Tag>
                <Tag variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">Completed</Tag>
                <Tag variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">Any</Tag>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Project Tags</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {techTags.map((tag, index) => (
                  <Tag key={index} variant="outline" size="sm" className="cursor-pointer hover:bg-muted/50">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Date Range</h3>
              <div className="flex items-center gap-2">
                <Input type="date" className="w-full" />
                <span>to</span>
                <Input type="date" className="w-full" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Showcase;
