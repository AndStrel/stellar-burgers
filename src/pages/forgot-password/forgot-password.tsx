import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { forgotPasswordApi } from '../../utils/burger-api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const { values, handleChange, setValues } = useForm({
    email: ''
  });
  // const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const { email } = values;
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError(new Error('Введите почту'));
      return;
    }
    forgotPasswordApi({ email })
      .then((res) => {
        localStorage.setItem('resetPassword', `${res.success}`);
        navigate('/reset-password', { replace: res.success });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
