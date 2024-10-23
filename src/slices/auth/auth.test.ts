import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import authSlice, {
  updateUser,
  updateTokens,
  setUser,
  setTokens,
  logout,
  startLoading,
  stopLoading
} from './authSlice';
import { updateUserApi, refreshToken } from '../../utils/burger-api';
import { TOrdersData } from '../../utils/types';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы authSlice.', () => {
    
});
