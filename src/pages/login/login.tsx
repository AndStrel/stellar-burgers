import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUserApi } from '../../utils/burger-api';
import { setTokens, setUser } from '../../slices/authSlice';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await loginUserApi({ email, password });

      // Сохраняем токены и данные пользователя в стор
      const { accessToken, refreshToken, user } = response;
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setUser(user));

      // Сохраняем токены в cookies и localStorage
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Перенаправление на защищенный маршрут профиля
      navigate('/profile');
    } catch (error) {
      setErrorText('Подумай хорошенько и попробуй ещё раз!');
      console.error('Login error:', error);
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
