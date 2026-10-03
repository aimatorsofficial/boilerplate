import { Spinner } from '../../components/Spinner';
import { ProfileCard } from './ProfileCard';
import { useCurrentUser } from './useCurrentUser';

export const CurrentUserProfile = () => {
  const { user } = useCurrentUser();
  return user ? <ProfileCard user={user} /> : <Spinner />;
};
