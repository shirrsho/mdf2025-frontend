import { queryClient } from '@/providers';

export const stallQueries = async (searchString: string): Promise<void> => {
  await queryClient.invalidateQueries({
    queryKey: [searchString],
    refetchType: 'active',
  });
};
