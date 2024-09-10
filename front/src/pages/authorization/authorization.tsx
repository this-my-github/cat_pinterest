import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './authorization.module.css';
import { loginUser, UserResponseError, UserResponseWithToken } from '../../api/user';

interface AuthFormInputs {
  login: string;
  password: string;
}

const authFormScheme = yup.object().shape({
  login: yup
    .string()
    .required('Заполните логин')
    .matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
    .min(3, 'Неверно заполнен логин. Минимум 3 символа')
    .max(15, 'Неверно заполнен логин. Максимум 15 символов'),
  password: yup
    .string()
    .required('Заполните пароль')
    .matches(/^[\w#%]+$/, 'Неверно заполнен пароль. Допускаются буквы и цифры и знаки # %')
    .min(6, 'Неверно заполнен пароль. Минимум 6 символов')
    .max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
});

export const Authorization: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: yupResolver(authFormScheme),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: AuthFormInputs) => {
    const { login, password } = data;
    try {
      const response = await loginUser({ login, password });
      if ((response as UserResponseError).message) {
        setServerError(`Ошибка запроса: ${(response as UserResponseError).message}`);
      } else {
        sessionStorage.setItem('token', (response as UserResponseWithToken).token);
      }
    } catch (error) {
      setServerError(`Ошибка запроса: ${(error as Error).message}`);
    }
  };

  const formError = errors.login?.message || errors.password?.message;
  const errorMessage = formError || serverError;

  const token = sessionStorage.getItem('token');
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Авторизация</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className={styles.input}
          type="text"
          placeholder="Логин..."
          {...register('login', {
            onChange: () => setServerError(null),
          })}
        />
        {errors.login && <span className={styles.error}>{errors.login.message}</span>}
        <input
          className={styles.input}
          type="password"
          placeholder="Пароль..."
          {...register('password', {
            onChange: () => setServerError(null),
          })}
        />
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        <button className={styles.button} type="submit" disabled={!!formError}>
          Авторизоваться
        </button>
        {errorMessage && <div className={styles.formError}>{errorMessage}</div>}
      </form>
      <Link to="/register" className={styles.link}>Регистрация</Link>
    </div>
  );
};