import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader/preloader';
import { useEffect } from 'react';
import { updateTokens } from '../../slices/auth/authSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (store) => store.auth
  );
  const location = useLocation();
  const dispatch = useDispatch();

  // Проверка, если токен истёк — пробуем обновить токен (по refresh токену).
  useEffect(() => {
    const Token = localStorage.getItem('refreshToken');
    if (!user && Token) {
      dispatch(updateTokens()); // Запрос на обновление токена
    }
  }, [dispatch, user]);

  // Если идёт загрузка данных о пользователе, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Если страница защищена только для неавторизованных пользователей и пользователь уже авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Если страница защищена для авторизованных пользователей, но пользователь не авторизован, редирект на логин
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если всё хорошо, отображаем дочерние компоненты
  return children;
};
