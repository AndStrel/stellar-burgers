import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userOrdersSlice, {
  fetchUserOrders,
  initialState
} from './userOrdersSlice';
import { getOrdersApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы userOrdersSlice.', () => {
  const testOrders = {
    success: true,
    orders: [
      {
        _id: '6704487b13a2b7001c8f0933',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0947',
          '643d69a5c3f7b9001cfa093f',
          '643d69a5c3f7b9001cfa0946'
        ],
        status: 'done',
        name: 'Флюоресцентный фалленианский люминесцентный бессмертный минеральный био-марсианский метеоритный бургер',
        createdAt: '2024-10-07T20:45:47.707Z',
        updatedAt: '2024-10-07T20:45:48.649Z',
        number: 55536
      },
      {
        _id: '670448b813a2b7001c8f0934',
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa094a',
          '643d69a5c3f7b9001cfa094a',
          '643d69a5c3f7b9001cfa094a',
          '643d69a5c3f7b9001cfa094a',
          '643d69a5c3f7b9001cfa094a',
          '643d69a5c3f7b9001cfa094a'
        ],
        status: 'done',
        name: 'Краторный астероидный бургер',
        createdAt: '2024-10-07T20:46:48.248Z',
        updatedAt: '2024-10-07T20:46:48.900Z',
        number: 55537
      },
      {
        _id: '6705196513a2b7001c8f0a74',
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0940'],
        status: 'done',
        name: 'Флюоресцентный метеоритный бургер',
        createdAt: '2024-10-08T11:37:09.280Z',
        updatedAt: '2024-10-08T11:37:10.050Z',
        number: 55576
      }
    ],
    total: 56967,
    totalToday: 153
  };
  const testError = 'Тестовая ошибка';
  const store = configureStore({ reducer: userOrdersSlice });

  test('Проверяем правильную инициализацию userOrdersSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
  });

  test('Проверка состояния при запросе заказов (pending)', () => {
    const actualState = userOrdersSlice(
      initialState,
      fetchUserOrders.pending('')
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при успешном запросе заказов (fulfilled)', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue({
      orders: testOrders.orders
    });
    const actualState = userOrdersSlice(
      initialState,
      fetchUserOrders.fulfilled(testOrders.orders, '')
    );
    expect(actualState).toEqual({
      ...initialState,
      orders: testOrders.orders,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при ошибке при запросе заказов (rejected)', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue({
      orders: testOrders.orders
    });
    const actualState = userOrdersSlice(
      initialState,
      fetchUserOrders.rejected(new Error(testError), '')
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: false,
      error: testError
    });
  });
});
