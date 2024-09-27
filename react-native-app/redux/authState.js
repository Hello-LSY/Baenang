// redux/authState.js
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, loadCredentials, clearCredentials } from './authSlice';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = (username, password) => {
    dispatch(loginUser({ username, password }));
  };

  const initializeAuth = () => {
    dispatch(loadCredentials());
  };

  const logout = () => {
    dispatch(clearCredentials());
  };

  return {
    auth,
    login,
    initializeAuth,
    logout,
  };
};
