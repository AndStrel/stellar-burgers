import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice, {
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
// import { initialState } from './ingredientsSlice';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы ingredientsSlice.', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Пробный ништяк',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Второй ништяк',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];
  const store = configureStore({ reducer: ingredientsSlice });

  const testError = 'Тестовая ошибка';

  test('Проверяем правильную инициализацию ingredientsSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.ingredients).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при запросе ингредиентов (pending)', () => {
    const actualState = ingredientsSlice(
      initialState,
      fetchIngredients.pending('')
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при успешном получении ингредиентов (fulfilled)', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
    const actualState = ingredientsSlice(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    expect(actualState).toEqual({
      ...initialState,
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });
  test('Проверка состояния при возврате ошибки (rejected)', () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
    const actualState = ingredientsSlice(
      initialState,
      fetchIngredients.rejected(new Error(testError), '')
    );
    expect(actualState).toEqual({
      ...initialState,
      ingredients: [],
      isLoading: false,
      error: testError
    });
  });
});
