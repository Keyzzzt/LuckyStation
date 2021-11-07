# Lucky Station Backend API

### Endpoints:

    GET /api/product       fetch all products
    GET /api/product/:id   fetch single product

### deserializeUser

    deserializeUser при КАЖДОМ запросе проверяет наличие JWT в куках.
    Если JWT есть - проверяет на валидность и помещает в req.user данные из JWT о пользователе.
    Если JWT "протух", но валиден, выдает новую пару access/refresh токенов.
    Это означает, что отсутствие объекта в req.user говорит нам о том, что пользователь не залогинен, либо токен "протух".
