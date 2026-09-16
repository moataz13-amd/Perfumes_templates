import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/helpers';

const UserContext = createContext(null);

const GUEST = { isAuthenticated: false };

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.user, GUEST);

  const login = useCallback(
    ({ email, password }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isAdmin =
            email === 'admin@scentora.com' || email.startsWith('scentora');
          setUser({
            isAuthenticated: true,
            name: isAdmin ? 'SCENTORA Admin' : 'Olivia Martin',
            email,
            avatar: null,
            customerSince: '2025-11-02',
            isAdmin,
          });
          resolve({ ok: true });
        }, 700);
      });
    },
    [setUser]
  );

  const register = useCallback(
    ({ name, email }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setUser({
            isAuthenticated: true,
            name: name || email.split('@')[0],
            email,
            avatar: null,
            customerSince: new Date().toISOString().slice(0, 10),
            isAdmin: false,
          });
          resolve({ ok: true });
        }, 700);
      });
    },
    [setUser]
  );

  const logout = useCallback(() => setUser(GUEST), [setUser]);

  const updateProfile = useCallback(
    (fields) => {
      setUser((prev) => (prev.isAuthenticated ? { ...prev, ...fields } : prev));
    },
    [setUser]
  );

  const value = useMemo(
    () => ({ user, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export default UserContext;