import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { logout } from '../../slices/auth/authSlice';
import { logoutApi } from '@api';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken') as string;
    if (!refreshToken) {
      console.error('Refresh token is missing');
      return;
    }
    try {
      // Отправляем запрос на выход
      await logoutApi(refreshToken);
      // Удаляем токены из cookies и localStorage
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');

      // Очищаем состояние пользователя
      dispatch(logout());

      // Перенаправляем на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе из профиля:', error);
    }
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
