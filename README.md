# Lucky Station Backend API

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
