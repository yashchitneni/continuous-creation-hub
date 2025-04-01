
// Create a new hackathon
export const useCreateHackathon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hackathon: Omit<Hackathon, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('hackathons')
        .insert([hackathon])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] });
      toast({
        title: 'Hackathon created',
        description: 'Your hackathon has been created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating hackathon',
        description: error.message || 'An error occurred while creating the hackathon.',
        variant: 'destructive',
      });
    }
  });
};
