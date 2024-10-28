import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import authSlice, {
  initialState,
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
  getUserApi,
  TUserResponse
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
  const testUserResponse: TUserResponse = {
    success: true,
    user: {
      name: 'testName',
      email: 'test@test.com'
    }
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
    const actualState = authSlice(
      initialState,
      updateUser.pending('', testUserData)
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при вызове updateUser (fulfilled)', async () => {
    (updateUserApi as jest.Mock).mockResolvedValue(testAuthResponse);
    const actualState = authSlice(
      initialState,
      updateUser.fulfilled(testUserResponse, '', testUserData)
    );
    expect(actualState).toEqual({
      ...initialState,
      user: testUserResponse.user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при вызове updateUser (rejected) и получении ошибки', async () => {
    (updateUserApi as jest.Mock).mockRejectedValue(testError);
    (updateUserApi as jest.Mock).mockResolvedValue(testAuthResponse);
    const actualState = authSlice(
      initialState,
      updateUser.rejected(new Error(testError), '', testUserData)
    );
    expect(actualState).toEqual({
      ...initialState,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: testError
    });
  });

  test('Проверка состояния при вызове updateTokens (pending)', () => {
    const actualState = authSlice(
      initialState,
      updateUser.pending('', testUserData)
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при вызове updateTokens (fulfilled)', async () => {
    (refreshToken as jest.Mock).mockResolvedValue(testRefreshResponse);
    const actualState = authSlice(
      initialState,
      updateTokens.fulfilled(testRefreshResponse, '')
    );
    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      accessToken: testRefreshResponse.accessToken,
      refreshToken: testRefreshResponse.refreshToken
    });
  });

  test('Проверка состояния при вызове updateTokens (rejected) и получении ошибки', async () => {
    (refreshToken as jest.Mock).mockRejectedValue(testError);
    const actualState = authSlice(
      initialState,
      updateTokens.rejected(new Error(testError), '')
    );
    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      isLoading: false,
      error: testError
    });
  });

  test('Проверка состояния при вызове getUser (pending)', () => {
    const actualState = authSlice(initialState, getUser.pending(''));
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при вызове getUser (fulfilled)', async () => {
    (getUserApi as jest.Mock).mockResolvedValue(testAuthResponse);

    const actualState = authSlice(
      initialState,
      getUser.fulfilled(testUserResponse, '')
    );
    expect(actualState).toEqual({
      ...initialState,
      user: testAuthResponse.user,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при вызове getUser (rejected) и получении ошибки', async () => {
    (getUserApi as jest.Mock).mockRejectedValue(testError);
    const actualState = authSlice(
      initialState,
      getUser.rejected(new Error(testError), '')
    );
    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      isLoading: false,
      error: testError
    });
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
