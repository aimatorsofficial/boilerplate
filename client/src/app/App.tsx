import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { queryClient } from '../lib/query-client';
import { appRoutes } from './routes';

const router = createBrowserRouter(appRoutes);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
