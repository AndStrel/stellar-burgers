import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ordersDataSlice, {
  fetchOrders,
  fetchOrderById,
  initialState
} from './ordersDataSlice';
import { getFeedsApi, TFeedsResponse } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы ordersDataSlice.', () => {
  const testOrders: TFeedsResponse = {
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
    const actualState = ordersDataSlice(initialState, fetchOrders.pending(''));
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при успешном запросе заказов (fulfilled)', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(testOrders);
    const actualState = ordersDataSlice(
      initialState,
      fetchOrders.fulfilled(testOrders, 'requestId')
    );
    expect(actualState).toEqual({
      ...initialState,
      orders: testOrders.orders,
      total: testOrders.total,
      totalToday: testOrders.totalToday,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при ошибке при запросе заказов (rejected)', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(testError);
    const actualState = ordersDataSlice(
      initialState,
      fetchOrders.rejected(new Error(testError), '')
    );
    expect(actualState).toEqual({
      ...initialState,
      orders: [],
      isLoading: false,
      error: testError
    });
  });

  test('Проверка состояния при запросе заказа по id (pending)', async () => {
    const actualState = ordersDataSlice(
      initialState,
      fetchOrderById.pending('6704487b13a2b7001c8f0933', 'requestId')
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при успешном запросе заказа по id (fulfilled) -добавляем новый', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(testOrdersById);
    const actualState = ordersDataSlice(
      initialState,
      fetchOrderById.fulfilled(
        testOrdersById.orders[0],
        'requestId',
        '6704487b13a2b7001c8f0933'
      )
    );
    expect(actualState).toEqual({
      ...initialState,
      orders: testOrdersById.orders,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при успешном запросе того же заказа по id (fulfilled) -обновляем', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(testOrdersById);
    const actualState = ordersDataSlice(
      initialState,
      fetchOrderById.fulfilled(
        testOrdersById.orders[0],
        'requestId',
        '6704487b13a2b7001c8f0933'
      )
    );

    const expectedState = ordersDataSlice(
      actualState,
      fetchOrderById.fulfilled(
        testOrdersById.orders[0],
        'requestId',
        '6704487b13a2b7001c8f0933'
      )
    );

    expect(expectedState).toEqual({
      ...actualState,
      orders: testOrdersById.orders,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при ошибке при запросе заказа по id (rejected)', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(testOrdersById);
    const actualState = ordersDataSlice(
      initialState,
      fetchOrderById.rejected(
        new Error(testError),
        '',
        '6704487b13a2b7001c8f0933'
      )
    );
    expect(actualState).toEqual({
      ...initialState,
      orders: [],
      isLoading: false,
      error: testError
    });
  });
});
