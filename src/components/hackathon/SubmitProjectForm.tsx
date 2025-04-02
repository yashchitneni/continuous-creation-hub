
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { DialogFooter } from '@/components/ui/dialog';
import { useCreateProject } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createProject = useCreateProject();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Project title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!imageUrl) newErrors.image = 'Project image is required';
    if (!githubLink.trim()) newErrors.githubLink = 'GitHub repository URL is required';
    if (!tags.trim()) newErrors.tags = 'At least one tag is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill out all the required fields.',
        variant: 'destructive',
      });
      return;
    }
    
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
    setErrors(prev => ({...prev, image: ''}));
  };
  
  const handleRemoveImage = () => {
    setImageUrl('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
        All fields except "Live Demo URL" are mandatory.
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title" className={errors.title ? 'text-destructive' : ''}>
          Project Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({...prev, title: ''}));
          }}
          placeholder="E.g., AI-Powered Task Manager"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className={errors.description ? 'text-destructive' : ''}>
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({...prev, description: ''}));
          }}
          placeholder="Describe what your project does and the technologies used..."
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>
      
      <div className="space-y-2">
        <Label className={errors.image ? 'text-destructive' : ''}>Project Image</Label>
        <div className="max-h-[200px] overflow-hidden">
          <ImageUpload
            onUploadComplete={handleImageUpload}
            defaultImageUrl={imageUrl}
            uploadPath="project-images"
          />
        </div>
        {imageUrl && (
          <div className="relative mt-2">
            <div className="max-h-[200px] overflow-hidden rounded-md border border-border">
              <img
                src={imageUrl}
                alt="Project preview"
                className="w-full h-full object-contain max-h-[200px]"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="githubLink" className={errors.githubLink ? 'text-destructive' : ''}>
          GitHub Repository URL
        </Label>
        <Input
          id="githubLink"
          type="url"
          value={githubLink}
          onChange={(e) => {
            setGithubLink(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({...prev, githubLink: ''}));
          }}
          placeholder="https://github.com/yourusername/project"
          className={errors.githubLink ? 'border-destructive' : ''}
        />
        {errors.githubLink && <p className="text-xs text-destructive">{errors.githubLink}</p>}
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
        <Label htmlFor="tags" className={errors.tags ? 'text-destructive' : ''}>
          Tags (Comma-separated)
        </Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({...prev, tags: ''}));
          }}
          placeholder="E.g., React, AI, Mobile, Web App"
          className={errors.tags ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas, e.g., "React, TypeScript, AI"
        </p>
        {errors.tags && <p className="text-xs text-destructive">{errors.tags}</p>}
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
