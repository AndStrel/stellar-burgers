import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { ProtectedRoute } from '../../components/protected-route/ProtectedRoute';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../../components';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { useEffect } from 'react';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import {
  setTokens,
  setUser,
  startLoading,
  stopLoading
} from '../../slices/authSlice';
import { getUserApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader/preloader';

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Определение фона для модалки
  const backgroundLocation = location.state?.background || null;
  const closeModal = () => {
    navigate(-1); // возвращаемся назад
  };

  // ставим useEffect для получения ингредиентов и проверки токенов
  useEffect(() => {
    // Запускаем загрузку
    dispatch(startLoading());
    // Запускаем загрузку ингредиентов
    dispatch(fetchIngredients());

    // Достаем актуальные токены которые есть в localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    // Если есть записанные в localStorage токены,
    if (refreshToken || accessToken) {
      dispatch(
        setTokens({
          accessToken: accessToken || '',
          refreshToken: refreshToken || ''
        })
      );
      //то получаем токены и данные пользователя с сервера
      getUserApi()
        .then((res) => {
          dispatch(setUser(res.user));
        })
        .catch((err) => {
          console.error('Ошибка:', err);
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    } else {
      dispatch(stopLoading());
    }
  }, [dispatch]);
  // Если данные о заказах не загружены, отображаем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали заказа'} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
