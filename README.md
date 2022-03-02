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
            Ссылка действительна 24ч
    2.  Если пользователь входит при помощи Google то есть несколько вариантов развития событий:
        a.  Пользователь с таким имейл уже зарегистрирован обычным способом, но имейл не верифицирован - удаляется этот пользователь и        создается аккаунт для Google авторизации. После создания Google аккаунта, регистрация обычным способом с таким же имейлом  невозможна.
        b.  Пользователь с таким имейл уже зарегистрирован обычным способом, и имейл верифицирован - происходит слияние и на этот аккаунт возможно зати обоими способами.
        с.  Пользователя с таким имейл нет - создается  аккаунт для Google авторизации. После создания Google аккаунта, регистрация обычным способом с таким же имейлом  невозможна.

### TODO

Привести в порядок типы
При создании пользователя через Google отправлять сообщение на имейл.
Доп информация в виде текста для админа о статичтике в dashboard

    Сейчас при update own profile мы выдаем новый токен, хотя изменяется только пароль. Если не будут изменятся важные данные, которые должны быть зашиты в токен, убрать выдачу нового токена. Проверить нужны ли в типе PayloadType isActivated & isAdmin данные

Составить список статистик и когда и где они регистрируются и сделать это.

Пройти по значениям в контроллерам и добавить .trim()

Ограничить выбор колличества товара на странице товара 5

При создании товара возвращает \_id товара, подумать что возвращать

Сделать отписку только для залогиненных пользователей

Сделать добавку в фавориты для не залогиненных в LocalStorage и не отправлять запрос. Так же сделать проверку для залогиненных, есть ли в localStorage массив favorites

Когда выдаем новую пару accessToken & refreshToken отвечаем объектом с accessToken & \_id пользователя. Проверить, нужно ли отправлять \_id.

Сейчас для добавления в фаворитс пользователь должен быть залогинен. Нужно сделать так, чтобы если не залогинен - добавить в localStorage массив id товаров
Избыточная информация о товаре при создании заказа, по сути нужен только id товара и колличество.

Добавить confirm password при регистрации
Сделать поля у заказов и новых товаров isDirty для обозначения новых, ни разу не просмотренных
Поставить дефолтные значения для pageNumber & limit
Переделать error middleware с класса на функцию
компонент ordersList лоадер крутится когда заказов не найдено
Путаница с восстановлением пароля на фронте
Описать алгоритм действий для ввода новых фич
Проверить выдачу нового рефреш токена. Выглядит что проброс ошибок не верен.
Проверить logout без refreshToken
Идет два запроса за товарами на главной
при запросе своих заказов - totalpages расчитывается из всех документов.
Tests
Cart page not loading
В WebDevGuide сделать мини React приложение с сервером, чтобы примеры были полностью рабочими.
Сделать прикольное окно об оповещении success / fail
loader https://codepen.io/supah/details/BjYLdW
loader https://codepen.io/scottloway/pen/zqoLyQ
Форма обратной связи.
Предпоказ товара перед созданием
При продаже имейл админу
При регистрации поле имя у пользователя брать из первой части имейла, и добавить возможность изменять имя в профиле
Отобразить на всех страницах актуальные fail / success чтобы понять где нужен reset
Sendgrid Работает не корректно, письма отправляет, но нет рузельтатов ответа пользователей
Разобраться с "/:keyword?/:page?/:limit?"
Инициализация проекта - смотреть камасутру
Оплата без регистрации
Drag&Drop изображения при создании товара
Редиректы при удачной активации и не удачной
Одинаковый naming ВЕЗДЕ
Если пользователь зашел с гугл - нужно убрать возможность смены пароля ?????????
Проверить выдется ли новый токен с новыми данными После изменения профиля пользователя, нужно выписать ему новые токены, с новыми данными. Иначе неактуальные данные будут сидеть в токене
Исключить возможность попытки смены имейла - только удаление пользователя админом с запросом пароля админа.
Заменить getRandom() на id с базы - посмотреть есть ли ошибки при удалении из списка

- Поле телефона у пользователя
- Удалять документ в модели токена при истечении refreshToken
- реализовать фильтры товаров - по ценам, датам и тд
- Хрень которая срабатывает не на каждый чих инпута а в интрвале
- Оптимизация - useCallback useMemo
- Языки
- <Layout> с брейкпоинтами
  // todo lazy loading kamasutra
  // TODO https://www.udemy.com/course/mern-ecommerce/learn/lecture/22498996#questions/12904054
  // TODO Не админ может получить любой order если знает orderId. Знать ID не своего заказа он вроде не может. Но нужна защита от дурака.
  Доделать AutoResizeTextarea / Range

// todo <Redirect to="/" />

# Улучшение / расширение после первого релиза.

Удалить lodash заменив своими функциями
Бронь товара на несколько минут при оформлении покупки (если сайт от этого зависит)Темная / светлая тема - для начала только у панели админа
Декомпозиция приложения
