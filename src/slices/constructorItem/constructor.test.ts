import { expect, test, describe } from '@jest/globals';
import constructorItemsSlice, {
  addIngredient,
  removeIngredient,
  setBun,
  setPrice,
  setOrderModalData,
  setOrderRequest,
  clearConstructor,
  moveDown,
  moveUp
} from './constructorItemsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

describe('Проверяем корректность работы constructorItemsSlice.', () => {
  //  создаем хранилище используя rootReducer как основный reducer
  const store = configureStore({ reducer: constructorItemsSlice });
  const ingredient1: TConstructorIngredient = {
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
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    id: '643d69a5c3f7b9001cfa093e-1729677284006'
  };
  const ingredient2: TConstructorIngredient = {
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
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: '643d69a5c3f7b9001cfa0941-1729679402708'
  };
  const ingredient3: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Третий соответственно',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
    id: '643d69a5c3f7b9001cfa093f-1729679405206'
  };
  const bun: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Булка для пробы',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    id: '643d69a5c3f7b9001cfa093d-1729677283174'
  };
  const order: TOrder | null = {
    _id: '643d69a5c3f7b9001cfa0940',
    ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0941'],
    status: 'done',
    name: 'Название',
    createdAt: '2022-12-12T13:33:05.000Z',
    updatedAt: '2022-12-12T13:33:05.000Z',
    number: 123456
  };
  test('Проверяем правильную инициализацию constructorItemsSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого стэйта
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.price).toBe(0);
  });

  test('Проверяем обработку экшена добавления ингредиента;', () => {
    // диспатчим экшен добавления ингредиента передав в него ингредиент
    store.dispatch(addIngredient(ingredient1));
    store.dispatch(addIngredient(ingredient2));
    store.dispatch(addIngredient(ingredient3));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.ingredients).toEqual([ingredient1, ingredient2, ingredient3]);
  });

  test('Проверяем обработку экшена перемещения ингредиента вниз;', () => {
    // store.dispatch(moveDown(1));
    const state = store.getState();
    expect(state.ingredients[0]).toEqual(ingredient1); // индекс 0
    expect(state.ingredients[1]).toEqual(ingredient2); // индекс 1
    expect(state.ingredients[2]).toEqual(ingredient3); // индекс 2

    // перемещаем второй ингредиент (index 1) вниз
    store.dispatch(moveDown(1));

    // получаем новое состояние
    const state2 = store.getState();
    // проверяем все поля переданного объекта с ожидаемым (второй ингредиент перемещен вниз, а 3й ингредиент вверх)
    expect(state2.ingredients[0]).toEqual(ingredient1);
    expect(state2.ingredients[1]).toEqual(ingredient3);
    expect(state2.ingredients[2]).toEqual(ingredient2);
  });

  // перемещаем второй ингредиент (index 1) вверх
  test('Проверяем обработку экшена перемещения ингредиента вверх;', () => {
    store.dispatch(moveUp(2));
    const state = store.getState();
    expect(state.ingredients[1]).toEqual(ingredient2);
  });

  test('Проверяем обработку экшена удаления ингредиента;', () => {
    // удаляем ингредиент с индексом 2 (ingredient3)
    store.dispatch(removeIngredient(2));
    const state = store.getState();
    expect(state.ingredients).toEqual([ingredient1, ingredient2]);
  });

  test('Проверяем обработку экшена добавления булки;', () => {
    store.dispatch(setBun(bun));
    const state = store.getState();
    // проверяем что булка добавлена в свое поле
    expect(state.bun).toEqual(bun);
  });

  test('Проверяем обработку экшена изменения цены;', () => {
    store.dispatch(setPrice(500));
    const state = store.getState();
    expect(state.price).toEqual(500);
  });

  test('Проверяем обработку экшена изменения состояния загрузки заказа в стор;', () => {
    store.dispatch(setOrderRequest(true));
    const state = store.getState();
    expect(state.orderRequest).toEqual(true);
  });

  test('Проверяем обработку экшена отображения заказа в модалке;', () => {
    store.dispatch(setOrderModalData(order));
    const state = store.getState();
    expect(state.orderModalData).toEqual(order);
  });

  test('Проверяем обработку экшена очистки конструктора;', () => {
    store.dispatch(clearConstructor());
    const state = store.getState();
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
