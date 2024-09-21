// src/QueryClient.ts
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Menonaktifkan refetch saat window fokus
      staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
    },
  },
});

export default queryClient;
