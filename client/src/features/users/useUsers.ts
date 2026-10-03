import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants';
import { usersApi } from './users.api';

export const useUsers = (page: number) =>
  useQuery({
    queryKey: QUERY_KEYS.usersPage(page),
    queryFn: () => usersApi.list(page),
    placeholderData: keepPreviousData,
  });
