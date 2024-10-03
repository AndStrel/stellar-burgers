import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams(); // Получаем id ингредиента из URL
  const dispatch = useDispatch(); // Инициализируем диспатч из стора
  const { ingredients, isLoading } = useSelector((state) => state.ingredients); // Получаем список ингредиентов из стора
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
