import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import authSlice, {
  updateUser,
  updateTokens,
  setUser,
  setTokens,
  logout,
  startLoading,
  stopLoading,
  getUser
} from './authSlice';
import {
  updateUserApi,
  refreshToken,
  TRegisterData,
  TAuthResponse,
  TRefreshResponse,
  getUserApi
} from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы authSlice.', () => {
  const testUserData: TRegisterData = {
    name: 'testName',
    password: 'testPassword',
    email: 'test@test.com'
  };

  const testTokens = {
    accessToken: 'testAccessToken',
    refreshToken: 'testRefreshToken'
  };

  const testAuthResponse: TAuthResponse = {
    success: true,
    refreshToken: 'testRefreshToken',
    accessToken: 'testAccessToken',
    user: {
      name: 'testName',
      email: 'test@test.com'
    }
  };

  const testRefreshResponse: TRefreshResponse = {
    success: true,
    refreshToken: 'testRefreshToken',
    accessToken: 'testAccessToken'
  };

  const testError = 'Тестовая ошибка';

  // создаем хранилище
  let store = configureStore({ reducer: authSlice });
  // обновляем хранилище перед каждым тестом
  beforeEach(() => {
    store = configureStore({ reducer: authSlice });
  });

  test('Проверяем правильную инициализацию authSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове updateUser (pending)', () => {
    // диспатчим экшен получения пользователя
    store.dispatch(updateUser(testUserData));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('Проверка состояния при вызове updateUser (fulfilled)', async () => {
    (updateUserApi as jest.Mock).mockResolvedValue(testAuthResponse);
    // диспатчим экшен получения пользователя
    await store.dispatch(updateUser(testUserData));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toEqual(testAuthResponse.user);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове updateUser (rejected) и получении ошибки', async () => {
    (updateUserApi as jest.Mock).mockRejectedValue(testError);
    // диспатчим экшен получения пользователя
    await store.dispatch(updateUser(testUserData));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(testError);
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове updateTokens (pending)', () => {
    // диспатчим экшен получения токенов
    store.dispatch(updateTokens());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('Проверка состояния при вызове updateTokens (fulfilled)', async () => {
    (refreshToken as jest.Mock).mockResolvedValue(testRefreshResponse);
    // диспатчим экшен получения токенов
    await store.dispatch(updateTokens());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toEqual(testRefreshResponse.accessToken);
    expect(state.refreshToken).toEqual(testRefreshResponse.refreshToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове updateTokens (rejected) и получении ошибки', async () => {
    (refreshToken as jest.Mock).mockRejectedValue(testError);
    // диспатчим экшен получения токенов
    await store.dispatch(updateTokens());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(testError);
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове getUser (pending)', () => {
    // диспатчим экшен получения пользователя
    store.dispatch(getUser());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('Проверка состояния при вызове getUser (fulfilled)', async () => {
    (getUserApi as jest.Mock).mockResolvedValue(testAuthResponse);
    // диспатчим экшен получения пользователя
    await store.dispatch(getUser());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toEqual(testAuthResponse.user);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове getUser (rejected) и получении ошибки', async () => {
    (getUserApi as jest.Mock).mockRejectedValue(testError);
    // диспатчим экшен получения пользователя
    await store.dispatch(getUser());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(testError);
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове редьюсера setUser', () => {
    // диспатчим экшен получения токенов
    store.dispatch(setUser(testAuthResponse.user));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toEqual(testAuthResponse.user);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове редьюсера setTokens', () => {
    // диспатчим экшен получения токенов
    store.dispatch(setTokens(testTokens));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toEqual(testTokens.accessToken);
    expect(state.refreshToken).toEqual(testTokens.refreshToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове экшена logout', () => {
    // устанавливаем токены
    store.dispatch(setTokens(testTokens));
    // устанавливаем пользователя
    store.dispatch(setUser(testAuthResponse.user));
    // получаем состояние хранилища
    let state = store.getState();
    // проверяем реальность / ожидание
    expect(state.user).toEqual(testAuthResponse.user);
    expect(state.accessToken).toEqual(testTokens.accessToken);
    expect(state.refreshToken).toEqual(testTokens.refreshToken);
    expect(state.isAuthenticated).toBe(true);
    // вызваем экшен выхода
    store.dispatch(logout());
    // получаем состояние хранилища
    state = store.getState();
    // проверяем реальность / ожидание
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('Проверка состояния при вызове экшена startLoading', () => {
    // диспатчим экшен получения токенов
    store.dispatch(startLoading());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('Проверка состояния при вызове экшена stopLoading', () => {
    // диспатчим экшен получения токенов
    store.dispatch(stopLoading());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});
