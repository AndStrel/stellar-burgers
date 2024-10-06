import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  // Получаем id ингредиента из URL
  const { id } = useParams();

  // Инициализируем диспатч из стора
  const dispatch = useDispatch();

  // Получаем список ингредиентов из стора
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  // Записываем данные ингредиента в переменную путем фильтрации по id
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  // Получаем список ингредиентов при монтировании компонента
  useEffect(() => {
    // Если ингредиенты еще не загружены, загружаем их
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  // Если ингредиент не найден, отображаем прелоадер
  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
