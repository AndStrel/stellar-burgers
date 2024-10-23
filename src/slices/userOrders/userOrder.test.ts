import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userOrdersSlice, { fetchUserOrders } from './userOrdersSlice';
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
    // диспатчим экшен получения заказов
    store.dispatch(fetchUserOrders());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual([]);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном запросе заказов (fulfilled)', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue({
      orders: testOrders.orders
    });
    // диспатчим экшен получения заказов
    await store.dispatch(fetchUserOrders());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual({ orders: testOrders.orders });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке при запросе заказов (rejected)', async () => {
    (getOrdersApi as jest.Mock).mockRejectedValue(testError);
    // обновляем хранилище
    const store = configureStore({ reducer: userOrdersSlice });
    // диспатчим экшен получения заказов
    await store.dispatch(fetchUserOrders());
    // получаем состояние хранилища
    const state = store.getState();
    expect(state.orders).toEqual([]);
    expect(state.isLoading).toBe(false);
    // проверяем что в хранилище записана ошибка
    expect(state.error).toEqual(testError);
  });
});
