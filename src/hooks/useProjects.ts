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

export interface VoteScores {
  story_score: number;
  style_score: number;
  function_score: number;
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

// Get user's votes for a project
export const useGetUserVote = (projectId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['votes', 'get', projectId, userId],
    queryFn: async () => {
      if (!projectId || !userId) return null;

      const { data, error } = await supabase
        .from('votes')
        .select('story_score, style_score, function_score')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data as VoteScores | null;
    },
    enabled: !!projectId && !!userId
  });
};

// Get project's average scores
export const useProjectScores = (projectId?: string) => {
  return useQuery({
    queryKey: ['projects', 'scores', projectId],
    queryFn: async () => {
      if (!projectId) return null;

      const { data, error } = await supabase
        .from('votes')
        .select('story_score, style_score, function_score')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          story_score: 0,
          style_score: 0,
          function_score: 0,
          total_score: 0,
          vote_count: 0
        };
      }
      
      const voteCount = data.length;
      const storyTotal = data.reduce((sum, vote) => sum + vote.story_score, 0);
      const styleTotal = data.reduce((sum, vote) => sum + vote.style_score, 0);
      const functionTotal = data.reduce((sum, vote) => sum + vote.function_score, 0);
      
      return {
        story_score: storyTotal / voteCount,
        style_score: styleTotal / voteCount,
        function_score: functionTotal / voteCount,
        total_score: (storyTotal + styleTotal + functionTotal) / voteCount,
        vote_count: voteCount
      };
    },
    enabled: !!projectId
  });
};

// Vote for a project with criteria scores
export const useVoteForProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      projectId, 
      userId, 
      storyScore, 
      styleScore, 
      functionScore 
    }: { 
      projectId: string, 
      userId: string, 
      storyScore: number, 
      styleScore: number, 
      functionScore: number 
    }) => {
      // First check if the hackathon is in judging phase
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('hackathon_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) throw projectError;
      
      const { data: hackathon, error: hackathonError } = await supabase
        .from('hackathons')
        .select('status')
        .eq('id', project.hackathon_id)
        .single();
      
      if (hackathonError) throw hackathonError;
      
      if (hackathon.status !== 'judging') {
        throw new Error('Voting is only allowed during the judging phase');
      }
      
      // Check if user is a participant
      const { data: participant, error: participantError } = await supabase
        .from('hackathon_participants')
        .select('*')
        .eq('hackathon_id', project.hackathon_id)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (participantError) throw participantError;
      
      if (!participant) {
        throw new Error('Only hackathon participants can vote');
      }
      
      // Insert or update vote
      const { data, error } = await supabase
        .from('votes')
        .upsert([{ 
          project_id: projectId, 
          user_id: userId,
          story_score: storyScore,
          style_score: styleScore,
          function_score: functionScore
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { ...data, hackathon_id: project.hackathon_id };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['votes', 'check', data.project_id, data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['votes', 'get', data.project_id, data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'scores', data.project_id] });
      
      // We need to be sure hackathon_id exists before invalidating queries
      if ('hackathon_id' in data) {
        queryClient.invalidateQueries({ queryKey: ['projects', 'hackathon', data.hackathon_id] });
      } else {
        // Alternatively, we could invalidate all hackathon project queries
        queryClient.invalidateQueries({ queryKey: ['projects', 'hackathon'] });
      }
      
      toast({
        title: 'Vote submitted',
        description: 'Your ratings have been recorded!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error voting',
        description: error.message || 'An error occurred while submitting your vote.',
        variant: 'destructive',
      });
    }
  });
};
