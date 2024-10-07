// redux/authState.js
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, loadCredentials, clearCredentials } from './authSlice';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth); // Redux 상태에서 auth 가져오기
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
    auth,  // 여기서 auth 상태를 그대로 반환
    fullName: auth.fullName, // fullName을 명시적으로 반환
    email: auth.email, // email 반환
    token: auth.token, // token 반환
    memberId: auth.memberId, // memberId 반환
    login,
    initializeAuth,
    logout,
  };
};
