import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ordersDataSlice, {
  fetchOrders,
  fetchOrderById
} from './ordersDataSlice';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrdersData } from '../../utils/types';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы ordersDataSlice.', () => {
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
  const testOrdersById = {
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
    ]
  };
  const testError = 'Тестовая ошибка';
  const store = configureStore({ reducer: ordersDataSlice });

  test('Проверяем правильную инициализацию ordersDataSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.orders).toEqual([]);
    expect(state.total).toEqual(0);
    expect(state.totalToday).toEqual(0);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при запросе заказов (pending)', () => {
    const store = configureStore({ reducer: ordersDataSlice });

    // диспатчим экшен получения заказов
    store.dispatch(fetchOrders());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual([]);
    expect(state.total).toEqual(0);
    expect(state.totalToday).toEqual(0);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном запросе заказов (fulfilled)', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(testOrders);
    // диспатчим экшен получения заказов
    await store.dispatch(fetchOrders());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual(testOrders.orders);
    expect(state.total).toEqual(testOrders.total);
    expect(state.totalToday).toEqual(testOrders.totalToday);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке при запросе заказов (rejected)', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(testError);
    // обновляем хранилище
    const store = configureStore({ reducer: ordersDataSlice });
    // диспатчим экшен получения заказов
    await store.dispatch(fetchOrders());
    // получаем состояние хранилища
    const state = store.getState();
    expect(state.orders).toEqual([]);
    expect(state.total).toEqual(0);
    expect(state.totalToday).toEqual(0);
    expect(state.isLoading).toBe(false);
    // проверяем что в хранилище записана ошибка
    expect(state.error).toEqual(testError);
  });

  test('Проверка состояния при запросе заказа по id (pending)', async () => {
    const store = configureStore({ reducer: ordersDataSlice });
    // диспатчим экшен получения заказа
    store.dispatch(fetchOrderById('643d69a5c3f7b9001cfa093c'));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual([]);
    expect(state.total).toEqual(0);
    expect(state.totalToday).toEqual(0);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном запросе заказа по id (fulfilled) -добавляем новый', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(testOrdersById);
    // диспатчим экшен получения заказа
    await store.dispatch(fetchOrderById('643d69a5c3f7b9001cfa093c'));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.orders).toEqual(testOrdersById.orders);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном запросе заказа по id (fulfilled) -обновляем', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(testOrdersById);
    // обновляем хранилище
    const store = configureStore({ reducer: ordersDataSlice });
    // получаем заказ
    await store.dispatch(fetchOrderById('643d69a5c3f7b9001cfa093c'));
    // получаем тот же самый заказ
    await store.dispatch(fetchOrderById('643d69a5c3f7b9001cfa093c'));
    // получаем состояние хранилища
    const state = store.getState();

    // Проверяем, что заказ был обновлен
    expect(state.orders.length).toBe(1); // Заказ остался один
    expect(state.orders[0]).toEqual(testOrdersById.orders[0]);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке при запросе заказа по id (rejected)', async () => {
    (getOrderByNumberApi as jest.Mock).mockRejectedValue(testError);
    // обновляем хранилище
    const store = configureStore({ reducer: ordersDataSlice });
    // диспатчим экшен получения заказа
    await store.dispatch(fetchOrderById('643d69a5c3f7b9001cfa093c'));
    // получаем состояние хранилища
    const state = store.getState();
    expect(state.orders).toEqual([]);
    expect(state.isLoading).toBe(false);
    // проверяем что в хранилище записана ошибка
    expect(state.error).toEqual(testError);
  });
});
