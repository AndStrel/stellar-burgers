describe('проверяем доступность страницы конструктора бургера', function () {
  // перед выполнением каждого теста сначала делаем перехват запроса на эндпоинт 'api/,
  // в ответе на который возвращаются созданные ранее моковые данные.
  beforeEach(() => {
    // Устанавливаем фейковые токены
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    });
    cy.setCookie('accessToken', 'fakeAccessToken');

    // перехват запросов на эндпоинт и замена на моковые данные
    cy.intercept('GET', `**/api/ingredients`, {
      fixture: 'ingredients.json'
    });
    cy.intercept('POST', `**/api/orders`, {
      fixture: 'postOrders.json'
    });
    cy.intercept('GET', `**/api/auth/user`, {
      fixture: 'getUser.json'
    });
    cy.intercept('POST', `**/api/auth/login`, {
      fixture: 'login.json'
    });
    cy.intercept('POST', `**/api/auth/logout`, {
      fixture: 'logout.json'
    });
  });

  afterEach(() => {
    // Очищаем localStorage и куки
    cy.clearLocalStorage(); // Полностью очищаем localStorage
    cy.clearCookie('accessToken');
    cy.wait(1000); // Ждем, чтобы данные успели очиститься
  });

  it('проверяем добавление ингредиента из списка в конструктор', function () {
    // запускаем  с главной страницы
    cy.visit('http://localhost:4000');
    cy.wait(500); // Ждем, чтобы токены успели установиться
    // находим кнопку по классу "common_button" и проверяем, что появилось 3 кнопки
    cy.get('.common_button').should('have.length', 3);
    // Находим элементы конструктора и проверяем, что они пустые
    cy.get('[data-cy="constructor-noHaveBun-top"]').contains(`Выберите булки`);
    cy.get('[data-cy="constructor-ingredient"]').contains(`Выберите начинку`);
    cy.get('[data-cy="constructor-noHaveBun-down"]').contains(`Выберите булки`);

    // находим первый ингредиент и нажимаем на добавления ингредиента
    cy.get('.common_button').first().click();

    // Находим элементы конструктора которые появляются при добавлении элемента в качестве булок, так же проверяем в них текст 'Пробная булка №1 верх/низ'
    cy.get('[data-cy="constructor-haveBun-top"]').contains(
      `Пробная булка №1 (верх)`
    );
    cy.get('[data-cy="constructor-haveBun-down"]').contains(
      `Пробная булка №1 (низ)`
    );

    // нажимаем на последнюю кнопку добавления ингредиента
    cy.get('.common_button').last().click();

    // находим элемент конструктора и проверяем, что  появился текст 'Пробный соус №3'
    cy.get('[data-cy="constructor-ingredient"]').contains(`Пробный соус №3`);
  });

  it('проверяем работу модальных окон', function () {
    // запускаем  с главной страницы
    cy.visit('http://localhost:4000');
    cy.wait(500); // Ждем, чтобы токены успели установиться
    // проверяем что находимся на главной странице
    cy.url().should('include', '/');

    // проверяем, что модальное окно закрыто
    cy.get('[data-cy="modal"]').should('not.exist');

    // находим первый ингредиент и нажимаем на него
    cy.get('[data-cy="ingredient"]').contains(`Пробная булка №1`).click();

    // проверяем, что появилось модальное окно именно с выбранным ингредиентом
    cy.get('[data-cy="modal"]').should('exist').contains(`Пробная булка №1`);

    // нажимаем на кнопку закрытия модального окна
    cy.get('[data-cy="modal-close-button"]').click();

    // проверяем, что модальное окно закрыто
    cy.get('[data-cy="modal"]').should('not.exist');

    // находим второй ингредиент и нажимаем на него
    cy.get('[data-cy="ingredient"]').contains(`Пробный ингридиент №2`).click();

    // проверяем, что появилось модальное окно именно с выбранным ингредиентом
    cy.get('[data-cy="modal"]')
      .should('exist')
      .contains(`Пробный ингридиент №2`);

    // проверяем что появился оверлей
    cy.get('[data-cy="modal-overlay"]').should('exist');

    // нажимаем на оверлей
    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    // проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    // находим третий ингредиент и нажимаем на него
    cy.get('[data-cy="ingredient"]').contains(`Пробный соус №3`).click();

    // проверяем, что появилось модальное окно именно с выбранным ингредиентом
    cy.get('[data-cy="modal"]').should('exist').contains(`Пробный соус №3`);

    // Нажимаем клавишу Esc
    cy.get('body').trigger('keydown', { key: 'Escape' });

    // проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('проверяем создание заказа с фековыми токенами', function () {
    // запускаем  с главной страницы
    cy.visit('http://localhost:4000');
    cy.wait(500); // Ждем, чтобы токены успели установиться
    // добавляем ингредиенты
    cy.get('.common_button').eq(0).click();
    cy.get('.common_button').eq(1).click();
    cy.get('.common_button').eq(2).click();

    // находим и нажимаем на кнопку создания заказа
    cy.get('.button_size_large').contains('Оформить заказ').click();

    // проверяем, что появилось модальное окно
    cy.get('[data-cy="modal"]').should('exist');
    cy.wait(1000);

    // проверяем, что появилось модальное окно именно с нашим идентификатором заказа
    cy.get('[data-cy="modal"]').should('exist').contains(`11111`);

    // Нажимаем клавишу Esc
    cy.get('body').trigger('keydown', { key: 'Escape' });

    // проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    //проверяем что конструктор пустой
    // Находим элементы конструктора и проверяем, что они пустые
    cy.get('[data-cy="constructor-noHaveBun-top"]').contains(`Выберите булки`);
    cy.get('[data-cy="constructor-ingredient"]').contains(`Выберите начинку`);
    cy.get('[data-cy="constructor-noHaveBun-down"]').contains(`Выберите булки`);

    // проверяем что цена заказа равна 0
    cy.get('[data-cy="constructor-total"]').contains(0);
  });

  it('проверяем login и logout', function () {
    cy.clearLocalStorage(); // Полностью очищаем localStorage
    cy.clearCookie('accessToken');

    // запускаем  с главной страницы
    cy.visit('http://localhost:4000');
    cy.wait(500); // Ждем, чтобы токены успели установиться
    // проверяем что находимся на главной странице
    cy.url().should('include', '/');

    // // находим и нажимаем на кнопку личного кабинета
    cy.get('[data-cy="profile-link"]').click();

    // Проверка переадресации на страницу авторизации
    cy.url().should('include', '/login');

    // находим кнопку "Войти" и нажимаем на нее
    cy.get('.button_size_medium').click();
    cy.wait(500);

    // Проверка переадресации на профиля
    cy.url().should('include', '/profile');

    // // находим и нажимаем на кнопку выхода
    cy.get('button').contains('Выход').click();

    // Проверка переадресации на профиля
    cy.url().should('include', '/login');
  });
});
