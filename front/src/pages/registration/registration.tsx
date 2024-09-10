import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './registration.module.css';
import { createUser, UserResponseError, UserResponseWithToken } from '../../api/user';

interface RegFormInputs {
  login: string;
  password: string;
  passcheck: string;
}

const regFormScheme = yup.object().shape({
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
  passcheck: yup
    .string()
    .required('Заполните повтор пароля')
    .oneOf([yup.ref('password')], 'Повтор пароля не совпадает'),
});

export const Registration: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegFormInputs>({
    defaultValues: {
      login: '',
      password: '',
      passcheck: '',
    },
    resolver: yupResolver(regFormScheme),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RegFormInputs) => {
    const { login, password } = data;
    try {
      const response = await createUser({ login, password });
      if ((response as UserResponseError).message) {
        setServerError(`Ошибка запроса: ${(response as UserResponseError).message}`);
      } else {
        sessionStorage.setItem('token', (response as UserResponseWithToken).token);
      }
    } catch (error) {
      setServerError(`Ошибка запроса: ${(error as Error).message}`);
    }
  };

  const formError =
    errors.login?.message || errors.password?.message || errors.passcheck?.message;
  const errorMessage = formError || serverError;

  const token = sessionStorage.getItem('token');
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Регистрация</h2>
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
        <input
          className={styles.input}
          type="password"
          placeholder="Повторите пароль..."
          {...register('passcheck', {
            onChange: () => setServerError(null),
          })}
        />
        {errors.passcheck && <span className={styles.error}>{errors.passcheck.message}</span>}
        <button className={styles.button} type="submit" disabled={!!formError}>
          Зарегистрироваться
        </button>
        {errorMessage && <div className={styles.formError}>{errorMessage}</div>}
      </form>
    </div>
  );
};