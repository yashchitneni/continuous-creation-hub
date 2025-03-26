
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BUCKET_NAME = "project-images";

/**
 * Upload an image to Supabase storage
 * @param file The file to upload
 * @param path Optional path within the bucket
 * @returns The public URL of the uploaded file, or null if upload failed
 */
export const uploadImage = async (file: File, path?: string): Promise<string | null> => {
  try {
    // Create a unique file path if not provided
    const filePath = path || `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    toast({
      title: "Upload Failed",
      description: "An unexpected error occurred during upload.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Delete an image from Supabase storage
 * @param path The path of the file to delete
 * @returns True if deletion was successful, false otherwise
 */
export const deleteImage = async (path: string): Promise<boolean> => {
  try {
    // Extract the file path from the full URL if needed
    const filePath = path.includes(`${BUCKET_NAME}/`) 
      ? path.split(`${BUCKET_NAME}/`)[1] 
      : path;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error during deletion:", error);
    toast({
      title: "Deletion Failed",
      description: "An unexpected error occurred during deletion.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Update an image in Supabase storage (delete old one and upload new one)
 * @param oldPath The path of the existing file
 * @param newFile The new file to upload
 * @param newPath Optional new path for the file
 * @returns The public URL of the updated file, or null if update failed
 */
export const updateImage = async (
  oldPath: string, 
  newFile: File, 
  newPath?: string
): Promise<string | null> => {
  // Delete the old file first (don't wait for it to complete)
  deleteImage(oldPath).catch(err => 
    console.error("Error removing old image:", err)
  );
  
  // Upload the new file
  return uploadImage(newFile, newPath);
};
