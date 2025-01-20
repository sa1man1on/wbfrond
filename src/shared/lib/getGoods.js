// const apiKey = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1MjM1NTg4OSwiaWQiOiIwMTk0NTRiNC00YWFmLTc0YjItYTFmYy1iNjJhYjRkZWMyMzYiLCJpaWQiOjE3OTMyMDM4LCJvaWQiOjE0MDg3NzEsInMiOjgsInNpZCI6IjEwYjYyMDM4LWFmY2YtNDIwMS04YzQwLTQ2ZTI0ZjQwZWZlOSIsInQiOmZhbHNlLCJ1aWQiOjE3OTMyMDM4fQ.TfN_-bxc_xxkRh-0pikWGM5RK15Zu1DUO1iaZVIsPkDfxxTFBzGcZHyX_uI9mYECLsIRveTSPOPqxdICObX1pQ'
// const productId = "226660673"

// Функция для получения товаров
async function getWildberriesGoods({
                                       apiKey = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1MjM1NTg4OSwiaWQiOiIwMTk0NTRiNC00YWFmLTc0YjItYTFmYy1iNjJhYjRkZWMyMzYiLCJpaWQiOjE3OTMyMDM4LCJvaWQiOjE0MDg3NzEsInMiOjgsInNpZCI6IjEwYjYyMDM4LWFmY2YtNDIwMS04YzQwLTQ2ZTI0ZjQwZWZlOSIsInQiOmZhbHNlLCJ1aWQiOjE3OTMyMDM4fQ.TfN_-bxc_xxkRh-0pikWGM5RK15Zu1DUO1iaZVIsPkDfxxTFBzGcZHyX_uI9mYECLsIRveTSPOPqxdICObX1pQ',
                                       limit = 100,
                                       offset = 0,
                                       filterNmID = null
                                   }) {
    // Базовый URL API
    const baseUrl = 'https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter';

    // Формируем параметры запроса
    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
    });

    // Добавляем артикул, если он указан
    if (filterNmID) {
        params.append('filterNmID', filterNmID.toString());
    }

    try {
        const response = await fetch(`${baseUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });

        // Проверяем статус ответа
        switch (response.status) {
            case 200:
                const data = await response.json();
                return {
                    success: true,
                    data: data
                };
            case 400:
                return {
                    success: false,
                    error: 'Неправильный запрос'
                };
            case 401:
                return {
                    success: false,
                    error: 'Пользователь не авторизован'
                };
            case 429:
                return {
                    success: false,
                    error: 'Слишком много запросов'
                };
            default:
                return {
                    success: false,
                    error: `Неизвестная ошибка: ${response.status}`
                };
        }
    } catch (error) {
        return {
            success: false,
            error: `Ошибка при выполнении запроса: ${error.message}`
        };
    }
}




// Получение списка товаров с пагинацией


// Получение информации о конкретном товаре по артикулу
export default getWildberriesGoods