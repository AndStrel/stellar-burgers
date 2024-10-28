import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../utils/burger-api';
import { setTokens, setUser } from '../../slices/auth/authSlice';
import { useDispatch } from '../../services/store';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';
export const Register: FC = () => {
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: ''
  });
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      // Отправка данных на сервер
      const response = await registerUserApi({
        name: values.name,
        email: values.email,
        password: values.password
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
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={handleChange}
      setPassword={handleChange}
      setUserName={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
