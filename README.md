# Lucky Station Backend API

### Список всех пользователей:

    Добавление
        - При регистрации
        - При покупке без регистрации /// не реализовано ///
        - При подписке с регистрацией
        - При подписке с без регистрации
    Удаление
        - админом /// не реализовано ///

### Список subscribed пользователей:

    Добавление
        - при подписке с регистрацией
        - при подписке без регистрации
    Удаление
        - админом /// не реализовано ///
        - при отписке через ссылку в имейле рассылки /// не реализовано ///

### Модель пользователей купивших не зарегистрировавшись:

### Модель сообщений формы обратной связи:

    user - _id если зарегистрированный, имейл если нет

// TODO:

- После удачной регистрации, при попытке логина перенаправляет на главную страницу, искать проблему!!!
- Поле телефона у пользователя
- Убрать express-validator - добавить свои функции валидации
- Удалять документ в модели токена при истечении refreshToken
- При продаже / сообщении - извещать админа
- Доделать AutoResizeTextarea / Range
- Добавление изображений - сейчас грузит но не отображает
- реализовать фильтры товаров - по ценам, датам и тд
- Хрень которая срабатывает не на каждый чих инпута а в интрвале
- Оптимизация - useCallback useMemo
- Sendgrid на фронте
- Восстановление пароля
- Drag&Drop
- Ссылка активации 24 часа
- При регистрации поле имя у пользователя брать из первой части имейла, и добавить возможность изменять имя в профиле
- Оплата без регистрации
- Одинаковый naming ВЕЗДЕ
- Инициализация проекта - смотреть камасутру
- роутинг как у UlbiTV
- Языки
- Темная / светлая тема - для начала только у панели админа
- Бронь товара на несколько минут при оформлении покупки (если сайт от этого зависит)
- <Layout> с брейкпоинтами

### Endpoints:

    GET     /api/auth           Authorization
    POST    /api/auth           Login
    DELETE  /api/auth           Logout
    POST    /api/auth/reg       Common registration
    GET     /api/auth/google
    GET     /api/product        Fetch all products
    GET     /api/product/:id    Fetch single product

### Для получения информации от sendgrid

    В параллельном терминале запускаем yarn tunnel

### Авторизация обычным способом и Google OAUTH 2.0

    1.  Если пользователь зарегистрировался обычным способом, то ему необходимо верифицировать почту перейдя по ссылке
            отправленной ему на указанную им почту. Пользователь с не верфицированной почтой не может залогиниться.
    2.  Если пользователь входит при помощи Google то есть несколько вариантов развития событий:
        a.  Пользователь с таким имейл уже зарегистрирован обычным способом, но имейл не верифицирован - удаляется этот пользователь и        создается аккаунт для Google авторизации. После создания Google аккаунта, регистрация обычным способом с таким же имейлом  невозможна.
        b.  Пользователь с таким имейл уже зарегистрирован обычным способом, и имейл верифицирован - происходит слияние и на этот аккаунт возможно зати обоими способами.
        с.  Пользователя с таким имейл нет - создается  аккаунт для Google авторизации. После создания Google аккаунта, регистрация обычным способом с таким же имейлом  невозможна.
