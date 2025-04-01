
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { DialogFooter } from '@/components/ui/dialog';
import { useCreateProject } from '@/hooks/useProjects';

interface SubmitProjectFormProps {
  hackathonId: string;
  userId: string;
  onClose: () => void;
}

const SubmitProjectForm: React.FC<SubmitProjectFormProps> = ({ 
  hackathonId, 
  userId, 
  onClose 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tags, setTags] = useState('');
  
  const createProject = useCreateProject();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const tagArray = tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    await createProject.mutateAsync({
      title,
      description,
      image_url: imageUrl,
      tags: tagArray,
      github_link: githubLink,
      website_url: websiteUrl || undefined,
      hackathon_id: hackathonId,
      user_id: userId
    });
    
    onClose();
  };
  
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., AI-Powered Task Manager"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what your project does and the technologies used..."
          required
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Project Image</Label>
        <ImageUpload
          onUploadComplete={handleImageUpload}
          defaultImageUrl={imageUrl}
          uploadPath="project-images"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="githubLink">GitHub Repository URL</Label>
        <Input
          id="githubLink"
          type="url"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/yourusername/project"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Live Demo URL (Optional)</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://your-project-demo.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="E.g., React, AI, Mobile, Web App"
          required
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas, e.g., "React, TypeScript, AI"
        </p>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createProject.isPending}>
          {createProject.isPending ? 'Submitting...' : 'Submit Project'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SubmitProjectForm;
