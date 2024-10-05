import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Menonaktifkan refetch saat window fokus
      staleTime: 1000 * 60 * 60 * 24, // Data dianggap fresh selama 24 jam
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

export default queryClient;
