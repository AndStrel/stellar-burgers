import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader/preloader';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (store) => store.auth
  );

  // Если идёт загрузка данных о пользователе, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }
  if (!isAuthenticated || !user) {
    // пока идёт загрузка пользователя, показываем прелоадер
    return <Navigate replace to='/login' />;
  }

  // Если всё хорошо, отображаем дочерние компоненты
  return children;
};
