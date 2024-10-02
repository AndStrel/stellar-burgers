import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { fetchIngredients } from '../../slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
