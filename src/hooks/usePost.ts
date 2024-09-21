
'use client'
// src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Post } from '../types/apiTypes';

async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await axiosInstance.get('/posts');
    console.log('Response:', response.data);
    return response.data; // Pastikan ini adalah array dari Post
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Re-throw the error for useQuery handling
  }
}

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
