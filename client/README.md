# MVP
## В базе добавить поле isPromo, который будет говорить что его надо отрендерить в Promo секции.
## Для сохранения дизайна ограничить текст колличеством символов.
## После обновления товара, в базе пропал массив images - проверить сервер. И дописать проверку на массив images
## Счетчик просмотра товаров не должен работать при просмотре админом
## Добавить поле для имени при регистрации
## При удалении товара/пользователя/заказа - спросить пароль у админа.
## Добавить в админке минимальный набор конфигурации сайта(налог, минимальный заказ для бесплатной доставки и тд)
## Поскольку пользователи могут регистрироваться и покупать в тот же самый момент когда админ в админке
## Админу не показывать секцию для подписки, в момент создания админа в базе - добавить подписку. Если права админа дали на сайте - атоматически подписать.

    то перед фильтрацией пользователей и заказов нужно бежать на сервер за свежимим данными.
    
    
    
# After MVP
## Добавить отправку сообщений пользователем и отображение с возможностью ответа в админке.
## Проверить что происходит когда удалется залогиненный пользователь
## Покрыть тестами
## Reviews
## Add Trustpilot 
## Добавть максимальное колличество символов для текста, чтобы не рушился дизайн, либо обрезать текст.
## Если админ только один, то нельзя удалитье его, передать права другому. То есть в момент удаления их должно быть минимум два.
## В демо версии нельзя удалять / изменять / добавлять
## Вынести все поля которые можно редактировать админом в config
## Endpoint req.body validation



