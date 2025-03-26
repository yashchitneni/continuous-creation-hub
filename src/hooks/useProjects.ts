
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  github_link: string;
  website_url?: string;
  hackathon_id: string;
  user_id: string;
  created_at: string;
}

// Fetch all projects for a hackathon
export const useHackathonProjects = (hackathonId?: string) => {
  return useQuery({
    queryKey: ['projects', 'hackathon', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return [];

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          votes: votes(project_id)
        `)
        .eq('hackathon_id', hackathonId);
      
      if (error) throw error;
      
      // Transform data to include vote count
      const projectsWithVotes = data.map(project => ({
        ...project,
        vote_count: Array.isArray(project.votes) ? project.votes.length : 0,
        votes: undefined // Remove the nested votes array
      }));
      
      // Sort by vote count in descending order
      return projectsWithVotes.sort((a, b) => b.vote_count - a.vote_count);
    },
    enabled: !!hackathonId
  });
};

// Fetch user projects
export const useUserProjects = (userId?: string) => {
  return useQuery({
    queryKey: ['projects', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*, hackathon:hackathons(title, status)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
};

// Fetch a specific project
export const useProject = (projectId?: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });
};

// Create a project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'hackathon', data.hackathon_id] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'user', data.user_id] });
      toast({
        title: 'Project submitted',
        description: 'Your project has been submitted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting project',
        description: error.message || 'An error occurred while submitting the project.',
        variant: 'destructive',
      });
    }
  });
};

// Check if user has already voted for a project
export const useHasVoted = (projectId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['votes', 'check', projectId, userId],
    queryFn: async () => {
      if (!projectId || !userId) return false;

      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!projectId && !!userId
  });
};

// Vote for a project
export const useVoteForProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string, userId: string }) => {
      // Check if already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If already voted, return early
      if (existingVote) {
        return { project_id: projectId, user_id: userId };
      }
      
      // Otherwise, cast a vote
      const { data, error } = await supabase
        .from('votes')
        .insert([{ project_id: projectId, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Get the project to get its hackathon_id
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('hackathon_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) throw projectError;
      
      return { ...data, hackathon_id: project.hackathon_id };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['votes', 'check', data.project_id, data.user_id] });
      
      // We need to be sure hackathon_id exists before invalidating queries
      if ('hackathon_id' in data) {
        queryClient.invalidateQueries({ queryKey: ['projects', 'hackathon', data.hackathon_id] });
      } else {
        // Alternatively, we could invalidate all hackathon project queries
        queryClient.invalidateQueries({ queryKey: ['projects', 'hackathon'] });
      }
      
      toast({
        title: 'Vote cast',
        description: 'Your vote has been recorded!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error voting',
        description: error.message || 'An error occurred while casting your vote.',
        variant: 'destructive',
      });
    }
  });
};
