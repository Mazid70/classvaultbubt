import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';
import useCallData from '../customHooks/useCallData';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosData = useCallData();

  const {
    data: user = null,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axiosData.get('/users/me');
      return res.data.user;
    },
    retry: false,
    staleTime: 0,
  });

  const handleLogout = async () => {
    try {
      await axiosData.post('/users/logout');
      window.location.reload()
    } catch (err) {
     return err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, refetch, isLoading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
