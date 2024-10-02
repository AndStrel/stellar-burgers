import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { IngredientDetails } from '.././/ingredient-details/ingredient-details';
import styles from './app.module.css';
import { AppHeader } from '@components';
export const App = () => (
  <div className={styles.app}>
    <Router>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title={''} onClose={() => {}}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
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
              <Modal title={''} onClose={() => {}}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title={''} onClose={() => {}}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </Router>
  </div>
);
