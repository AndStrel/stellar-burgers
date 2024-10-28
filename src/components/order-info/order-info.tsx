import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderById } from '../../slices/ordersData/ordersDataSlice';

export const OrderInfo: FC = () => {
  // Инициализируем диспатч из стора
  const dispatch = useDispatch();

  // Получаем orderId из URL
  const { number } = useParams<{ number: string }>();

  // Записываем данные о заказе в переменную
  const orderData = useSelector((state) =>
    state.ordersData.orders.find((order) => order.number.toString() === number)
  );
  // Записываем список ингредиентов в переменную
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );
  // Записываем состояние загрузки в переменную
  const isLoading = useSelector((state) => state.order.isLoading);

  // Записываем состояние ошибки в переменную
  const error = useSelector((state) => state.order.error);

  // Загружаем данные о заказе при их отсутствии
  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderById(number));
    }
  }, [dispatch, orderData, number]);
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Ошибка загрузки заказа: {error}</div>;
  if (!orderInfo) return <div>Заказ не найден.</div>;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
