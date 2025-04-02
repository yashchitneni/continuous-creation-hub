import React, { useState, useCallback } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/utils/storageUtils';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadStarted?: () => void;
  defaultImageUrl?: string;
  className?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  uploadPath?: string;
}

export function ImageUpload({
  onUploadComplete,
  onUploadStarted,
  defaultImageUrl,
  className = '',
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  uploadPath
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Prevent duplicate upload attempts
    if (isUploading || uploadStarted) {
      console.log('Upload already in progress, ignoring duplicate request');
      return;
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload one of the following file types: ${allowedTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadStarted(true);
    
    // Call the onUploadStarted callback if provided
    if (onUploadStarted) {
      onUploadStarted();
    }
    
    try {
      const url = await uploadImage(file, uploadPath);
      if (url) {
        setImageUrl(url);
        onUploadComplete(url);
        toast({
          title: "Upload successful",
          description: "Your image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Keep uploadStarted true to prevent duplicate uploads until component is unmounted
    }
  }, [allowedTypes, maxSizeMB, onUploadComplete, onUploadStarted, uploadPath, isUploading, uploadStarted]);
  
  const clearImage = useCallback(() => {
    setImageUrl(null);
    setUploadStarted(false);
    onUploadComplete('');
  }, [onUploadComplete]);
  
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {imageUrl ? (
        <div className="relative w-full">
          <img 
            src={imageUrl} 
            alt="Uploaded image" 
            className="w-full h-auto rounded-lg object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <ImagePlus className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 mb-1">Click to upload an image</p>
            <p className="text-xs text-gray-400">
              {`(max: ${maxSizeMB}MB, formats: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')})`}
            </p>
            {isUploading && (
              <div className="mt-2 flex items-center gap-2">
                <Upload className="h-4 w-4 animate-bounce text-gray-400" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            )}
          </div>
          <input 
            type="file"
            onChange={handleFileChange}
            accept={allowedTypes.join(',')}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
