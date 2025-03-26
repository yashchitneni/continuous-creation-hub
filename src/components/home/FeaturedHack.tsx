
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import CardHover from '@/components/ui/card-hover';

interface FeaturedHackProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
  };
}

const FeaturedHack = ({
  id,
  title,
  description,
  imageUrl,
  tags,
  author,
}: FeaturedHackProps) => {
  return (
    <CardHover 
      imageUrl={imageUrl}
      className="w-full h-[500px] md:h-[600px]"
    >
      <div className="p-8 h-full flex flex-col justify-end">
        <div className="max-w-2xl">
          <div className="mb-6 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag key={index} variant="primary" size="md">
                {tag}
              </Tag>
            ))}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          
          <p className="text-muted-foreground mb-6 max-w-xl">
            {description}
          </p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-jungle"
              />
              <div>
                <p className="text-sm font-medium">{author.name}</p>
                <p className="text-xs text-muted-foreground">Featured Creator</p>
              </div>
            </div>
          </div>
          
          <Button asChild>
            <Link to={`/showcase/${id}`} className="inline-flex items-center">
              View Project <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </CardHover>
  );
};

export default FeaturedHack;
