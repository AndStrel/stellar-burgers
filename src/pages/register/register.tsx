import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../utils/burger-api';
import { setTokens, setUser } from '../../slices/authSlice';
import { useDispatch } from '../../services/store';
import { setCookie } from '../../utils/cookie';
export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      // Отправка данных на сервер
      const response = await registerUserApi({
        name: userName,
        email: email,
        password: password
      });
      // Сохраняем токены и данные пользователя в стор
      const { accessToken, refreshToken, user } = response;
      dispatch(setTokens({ accessToken, refreshToken }));
      dispatch(setUser(user));

      // Сохраняем токены в cookies и localStorage
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Перенаправление на страницу логина или профиля
      navigate('/login');
    } catch (error) {
      // Обработка ошибок
      setErrorText('Ошибка при регистрации. Попробуйте снова.');
      console.error(error);
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
