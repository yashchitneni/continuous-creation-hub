
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, MessageSquare } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import CardHover from '@/components/ui/card-hover';

interface HackCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  author: {
    name: string;
    avatarUrl: string;
  };
  likes: number;
  comments: number;
  className?: string;
}

const HackCard = ({
  id,
  title,
  description,
  imageUrl,
  tags,
  author,
  likes,
  comments,
  className,
}: HackCardProps) => {
  return (
    <CardHover 
      imageUrl={imageUrl}
      className={className}
    >
      <Link to={`/showcase/${id}`} className="block p-6 h-full">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <Tag key={index} variant="outline" size="sm">
                  {tag}
                </Tag>
              ))}
              {tags.length > 3 && (
                <Tag variant="outline" size="sm">
                  +{tags.length - 3}
                </Tag>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-jungle transition-colors">
              {title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-muted-foreground">{author.name}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart size={14} className="text-coral" />
                <span className="text-xs text-muted-foreground">{likes}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MessageSquare size={14} className="text-cambridge" />
                <span className="text-xs text-muted-foreground">{comments}</span>
              </div>
              
              <ArrowUpRight 
                size={16} 
                className="text-jungle opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" 
              />
            </div>
          </div>
        </div>
      </Link>
    </CardHover>
  );
};

export default HackCard;
