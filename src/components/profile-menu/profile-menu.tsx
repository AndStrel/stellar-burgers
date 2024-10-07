import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { deleteCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { logout } from '../../slices/authSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токены из cookies и localStorage
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');

    // Очищаем состояние пользователя
    dispatch(logout());

    // Перенаправляем на страницу входа
    navigate('/login');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
