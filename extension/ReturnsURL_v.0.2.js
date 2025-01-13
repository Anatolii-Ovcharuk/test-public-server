/* "Returns for URL", v. 0.2 - 24.12.2024 | MIT License | Made by Anatolii Ovcharuk - https://github.com/Anatolii-Ovcharuk */
/* Description: This is a JS File for Node.js. */

    /* INSTALLATION */
/* Add in JS script: const returns = require('./ReturnsURL_v.0.2'); 
Call full functions: returns(*code*, *data*);
Call functions with default data: returns(*code*); */

    /* OPTIONS */
const DEFAULT_DATA = false; // Or use other value:  false, [], {}, '', 0, null
const DEFAULT_LOCALE = 'en-GB'; /* For Date - Locale is explicitly set (must be in string):
en-US - US English uses month-day-year order and 12-hour time with AM/PM.
en-GB - British English uses day-month-year order and 24-hour time without AM/PM.
ko-KR - Korean uses year-month-day order and 12-hour time with AM/PM.
ar-EG - Arabic in most Arabic-speaking countries uses Eastern Arabic numerals.
ja-JP-u-ca-japanese - For Japanese, applications may want to use the Japanese calendar, where 2012 was the year 24 of the Heisei era.
["ban", "id"] - When requesting a language that may not be supported, such as Balinese, include a fallback language (in this case, Indonesian)
*/

/*
The status codes listed below are defined by RFC 9110 - https://httpwg.org/specs/rfc9110.html#overview.of.status.codes
All information on: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
List of codes:
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/


function returns(code, data = DEFAULT_DATA, date = (new Date()).toLocaleString(DEFAULT_LOCALE).replaceAll("/", ".")) {
    switch (code.toString()) {

        /* ================== Informational responses (100-103) ================== */

        case "100": 
            return {
                status: 'Continue',
                code: code,
                message: 'Continue. This interim response indicates that the client should continue the request or ignore the response if the request is already finished.',
                message_ru: 'Промежуточный ответ, он указывает, что клиент должен продолжить запрос или игнорировать этот ответ, если запрос уже завершен.',
                date: date,
                data: data,
            };
        case "101": 
            return {
                status: 'Switching Protocols',
                code: code,
                message: 'Switching Protocols. This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.',
                message_ru: 'Этот код отправляется в ответ на заголовок запроса Upgrade от клиента и указывает протокол, на который переключается сервер.',
                date: date,
                data: data,
            };
        case "102": // Deprecated. Not for use in new websites.
            return {
                status: 'Processing',
                code: code,
                message: 'Processing. This code was used in WebDAV contexts to indicate that a request has been received by the server, but no status was available at the time of the response.',
                message_ru: 'Сервер получил и обрабатывает запрос, но ответа пока нет.',
                date: date,
                data: data,
            };
        case "103": 
            return {
                status: 'Early Hints',
                code: code,
                message: 'Early Hints. This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response or preconnect to an origin from which the page will need resources.',
                message_ru: 'Этот код в первую очередь предназначен для использования с заголовком Link, позволяя пользовательскому агенту начать предварительную загрузку ресурсов или осуществить предварительное соединение к источнику ресурсов, пока сервер готовит ответ.',
                date: date,
                data: data,
            };

        /* ================== Successful responses (200-208, 226) ================== */

        case "200": 
            return {
                status: 'OK',
                code: code,
                message: 'OK. Success. The request successful.',
                message_ru: 'OK. Запрос успешно выполнен.',
                date: date,
                data: data,
            };        
        case "201": 
            return {
                status: 'Created',
                code: code,
                message: 'Created. The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.',
                message_ru: 'Запрос выполнен успешно, и в результате был создан новый ресурс. Обычно это ответ, отправляемый на запросы POST или PUT.',
                date: date,
                data: data,
            };       
        case "202": 
            return {
                status: 'Accepted',
                code: code,
                message: 'Accepted. The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.',
                message_ru: 'Запрос получен, но еще не обработан. Это «уклончивый» ответ, поскольку в HTTP нет возможности позже отправить асинхронный ответ с результатом обработки запроса. Этот код предназначен для случаев, когда запрос обрабатывается другим процессом или сервером, а также для пакетной обработки.',
                date: date,
                data: data,
            };        
        case "203": 
            return {
                status: 'Non-Authoritative Information',
                code: code,
                message: 'Non-Authoritative Information. This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.',
                message_ru: 'Возвращенные метаданные не полностью совпадают с теми, которые доступны на исходном сервере, а получены из другого источника. Чаще всего это используется для зеркал или резервных копий ресурсов. За исключением таких случаев предпочтительнее использовать ответ 200 OK.',
                date: date,
                data: data,
            };  
        case "204": 
            return {
                status: 'No Content',
                code: code,
                message: 'No Content. There is no content to send for this request, but the headers are useful. The user agent may update its cached headers for this resource with the new ones.',
                message_ru: 'Для этого запроса нет содержимого для отправки, но заголовки ответа могут быть полезны. Пользовательский агент может использовать их для обновления закешированных заголовков, полученных ранее для этого ресурса.',
                date: date,
                data: data,
            };        
        case "205": 
            return {
                status: 'Reset Content',
                code: code,
                message: 'Reset Content. Tells the user agent to reset the document which sent this request.',
                message_ru: 'Сообщает пользовательскому агенту, что необходимо сбросить отображение документа, который отправил этот запрос.',
                date: date,
                data: data,
            };  
        case "206": 
            return {
                status: 'Partial Content',
                code: code,
                message: 'Partial Content. This response code is used in response to a range request when the client has requested a part or parts of a resource.',
                message_ru: 'Этот код ответа используется, когда от клиента отправляется заголовок Range для запроса только части ресурса.',
                date: date,
                data: data,
            };        
        case "207": 
            return {
                status: 'Multi-Status',
                code: code,
                message: 'Multi-Status (WebDAV). Conveys information about multiple resources, for situations where multiple status codes might be appropriate.',
                message_ru: 'Передаёт информацию о нескольких ресурсах в случаях, когда могут быть уместны несколько кодов состояния.',
                date: date,
                data: data,
            };  
        case "208": 
            return {
                status: 'Already Reported',
                code: code,
                message: 'Already Reported (WebDAV). Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.',
                message_ru: 'Используется внутри элемента ответа <dav:propstat>, чтобы избежать повторного перечисления «привязок» и дублирования данных.',
                date: date,
                data: data,
            };        
        case "226": 
            return {
                status: 'IM Used',
                code: code,
                message: 'IM Used (HTTP Delta encoding). The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
                message_ru: 'Используется для ответа на запросы GET в тех случаях, когда сервер хочет отправить только изменённую часть ресурса (то есть «дельту»).',
                date: date,
                data: data,
            };  
        
        /* ================== Redirection messages (300-308) ================== */

        case "300": 
            return {
                status: 'Multiple Choices',
                code: code,
                message: 'Multiple Choices. In agent-driven content negotiation, the request has more than one possible response and the user agent or user should choose one of them. There is no standardized way for clients to automatically choose one of the responses, so this is rarely used.',
                message_ru: 'У запроса более одного возможного ответа. Пользовательский агент или пользователь должен выбрать один из них. Не существует стандартизированного способа выбора одного из ответов, но рекомендуется использовать HTML-ссылки на возможные варианты, чтобы у пользователя была возможность выбора.',
                date: date,
                data: data,
            };        
        case "301": 
            return {
                status: 'Moved Permanently',
                code: code,
                message: 'Moved Permanently. The URL of the requested resource has been changed permanently. The new URL is given in the response.',
                message_ru: 'URL-адрес запрошенного ресурса был изменен навсегда. Новый URL-адрес указан в ответе.',
                date: date,
                data: data,
            };  
        case "302": 
            return {
                status: 'Found',
                code: code,
                message: 'Found. This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future, so the same URI should be used by the client in future requests.',
                message_ru: 'URI запрошенного ресурса был временно изменен. В будущем могут быть внесены дальнейшие изменения в URI. Следовательно, этот же URI должен использоваться клиентом в будущих запросах.',
                date: date,
                data: data,
            };        
        case "303": 
            return {
                status: 'See Other',
                code: code,
                message: 'See Other. The server sent this response to direct the client to get the requested resource at another URI with a GET request.',
                message_ru: 'Клиенту необходимо получить запрошенный ресурс по другому URI с помощью запроса GET.',
                date: date,
                data: data,
            }; 
        case "304": 
            return {
                status: 'Not Modified',
                code: code,
                message: 'Not Modified. This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.',
                message_ru: 'Этот код используется для целей кэширования. Он сообщает клиенту, что ответ не был изменен, поэтому клиент может продолжать использовать кэшированную версию ответа.',
                date: date,
                data: data,
            };        
        case "305": // Deprecated. Not for use in new websites.
            return {
                status: 'Use Proxy',
                code: code,
                message: 'Use Proxy. Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.',
                message_ru: 'Запрошенный ответ должен быть доступен через прокси. Этот код определен в предыдущей версии спецификации HTTP и в настоящее время устарел из-за проблем безопасности, связанных с внутренней настройкой прокси-сервера.',
                date: date,
                data: data,
            };  
        case "306": 
            return {
                status: 'Unused',
                code: code,
                message: 'Unused. This response code is no longer used; but is reserved. It was used in a previous version of the HTTP/1.1 specification.',
                message_ru: 'Этот код ответа зарезервирован. Использовался в предыдущей версии спецификации HTTP/1.1.',
                date: date,
                data: data,
            };        
        case "307": 
            return {
                status: 'Temporary Redirect',
                code: code,
                message: 'Temporary Redirect. The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request. This has the same semantics as the 302 Found response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the redirected request.',
                message_ru: 'Клиенту необходимо получить запрошенный ресурс по другому URI тем же методом, который использовался в предыдущем запросе. Он имеет ту же семантику, что и код ответа 302 Found, за исключением того, что пользовательский агент не должен изменять используемый метод: если в первом запросе использовался POST, то POST должен использоваться и во втором запросе.',
                date: date,
                data: data,
            };  
        case "308": 
            return {
                status: 'Permanent Redirect',
                code: code,
                message: 'Permanent Redirect. This means that the resource is now permanently located at another URI, specified by the Location response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.',
                message_ru: 'Ресурс теперь находится по другому URI, указанному в заголовке ответа Location. Он имеет ту же семантику, что и код ответа 301 Moved Permanently, за исключением того, что пользовательский агент не должен изменять используемый метод: если в первом запросе использовался POST, то POST должен использоваться и во втором запросе.',
                date: date,
                data: data,
            }; 
        
        /* ================== Client error responses (400-418, 421-426, 428, 429, 431, 451) ================== */

        case "400":
            return {
                status: 'Bad Request',
                code: code,
                message: 'Error. Bad Request. The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
                message_ru: 'Ошибка. Сервер не может или не будет обрабатывать запрос из-за чего-то, что воспринимается как ошибка клиента (например, неправильный синтаксис, формат или маршрутизация запроса).',
                date: date,
                data: data,
            };
        case "401":
            return {
                status: 'Unauthorized',
                code: code,
                message: 'Error. Unauthorized. Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.',
                message_ru: 'Ошибка. Хотя стандарт HTTP определяет этот ответ как «неавторизованный», семантически он означает «неаутентифицированный». Это значит, что клиент должен аутентифицировать себя, чтобы получить запрошенный ответ.',
                date: date,
                data: data,
            };
        case "402":
            return {
                status: 'Payment Required',
                code: code,
                message: 'Error. Payment Required. The initial purpose of this code was for digital payment systems, however this status code is rarely used and no standard convention exists.',
                message_ru: 'Ошибка. Этот код ответа зарезервирован для использования в будущем. Первоначальной целью создания этого кода было использование его для цифровых платежных систем, однако он используется очень редко и стандартного соглашения не существует.',
                date: date,
                data: data,
            };
        case "403":
            return {
                status: 'Forbidden',
                code: code,
                message: 'Error. Forbidden. The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the clients identity is known to the server.',
                message_ru: 'Ошибка. Клиент не имеет прав доступа к контенту, то есть он неавторизован, поэтому сервер отказывается предоставить запрошенный ресурс. В отличие от 401 Unauthorized, личность клиента известна серверу.',
                date: date,
                data: data,
            };
        case "404":
            return {
                status: 'Not Found',
                code: code,
                message: 'Error. Not Found. The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.',
                message_ru: 'Ошибка. Сервер не может найти запрошенный ресурс. В браузере это означает, что URL-адрес не распознан. В API это также может означать, что адрес правильный, но ресурс не существует. Сервер также может отправить этот код ответа вместо 403 Forbidden, чтобы скрыть существование ресурса от неавторизованного клиента. Это самый известный код ответа из-за его частого появления в сети.',
                date: date,
                data: data,
            };
        case "405":
            return {
                status: 'Method Not Allowed',
                code: code,
                message: 'Error. Method Not Allowed. The request method is known by the server but is not supported by the target resource. For example, an API may not allow DELETE on a resource, or the TRACE method entirely.',
                message_ru: 'Ошибка. Метод запроса известен серверу, но не поддерживается целевым ресурсом. Например, API может не разрешать вызов DELETE для удаления ресурса.',
                date: date,
                data: data,
            };
        case "406":
            return {
                status: 'Not Acceptable',
                code: code,
                message: 'Error. Not Acceptable. This response is sent when the web server, after performing server-driven content negotiation, does not find any content that conforms to the criteria given by the user agent.',
                message_ru: 'Ошибка. Сервер после выполнения согласования контента не нашёл содержимого, соответствующего критериям, заданным пользовательским агентом.',
                date: date,
                data: data,
            };
        case "407":
            return {
                status: 'Proxy Authentication Required',
                code: code,
                message: 'Error. Proxy Authentication Required. This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.',
                message_ru: 'Ошибка. Этот код ответа похож на 401 Unauthorized, но аутентификация должна выполняться через прокси-сервер.',
                date: date,
                data: data,
            };
        case "408":
            return {
                status: 'Request Timeout',
                code: code,
                message: 'Error. Request Timeout. This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers use HTTP pre-connection mechanisms to speed up browsing. Some servers may shut down a connection without sending this message.',
                message_ru: 'Ошибка. Сервер может отправить этот код ответа при неиспользовании соединения, даже без предварительного запроса со стороны клиента. Он означает, что сервер хотел бы закрыть это соединение. Этот ответ используется сравнительно часто, поскольку некоторые браузеры (такие как Chrome, Firefox 27+ или IE9) для ускорения используют механизмы предварительного подключения HTTP. Некоторые серверы просто закрывают соединение, не отправляя это сообщение.',
                date: date,
                data: data,
            };
        case "409":
            return {
                status: 'Conflict',
                code: code,
                message: 'Error. Conflict. This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.',
                message_ru: 'Ошибка. Запрос конфликтует с текущим состоянием сервера.',
                date: date,
                data: data,
            };
        case "410":
            return {
                status: 'Gone',
                code: code,
                message: 'Error. Gone. This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.',
                message_ru: 'Ошибка. Запрошенное содержимое было удалено с сервера, и отсутствует возможность переадресации. Ожидается, что клиенты удалят свои кеши и ссылки на этот ресурс. Спецификация HTTP предполагает, что этот код ответа будет использоваться для «ограниченных по времени или рекламных услуг». API не обязаны указывать ресурсы, которые были удалены, с помощью этого кода.',
                date: date,
                data: data,
            };
        case "411":
            return {
                status: 'Length Required',
                code: code,
                message: 'Error. Length Required. Server rejected the request because the Content-Length header field is not defined and the server requires it.',
                message_ru: 'Ошибка. Запрос отклонён, потому что сервер требует указание поля заголовка Content-Length, но оно не определено.',
                date: date,
                data: data,
            };
        case "412":
            return {
                status: 'Precondition Failed',
                code: code,
                message: 'Error. Precondition Failed. In conditional requests, the client has indicated preconditions in its headers which the server does not meet.',
                message_ru: 'Ошибка. Клиент указал в заголовках запроса условия, которым сервер не соответствует.',
                date: date,
                data: data,
            };
        case "413":
            return {
                status: 'Content Too Large',
                code: code,
                message: 'Error. Content Too Large. The request body is larger than limits defined by server. The server might close the connection or return an Retry-After header field.',
                message_ru: 'Ошибка. Размер объекта запроса превышает ограничения, определенные сервером. Сервер может закрыть соединение или вернуть поле заголовка Retry-After.',
                date: date,
                data: data,
            };
        case "414":
            return {
                status: 'URI Too Long',
                code: code,
                message: 'Error. URI Too Long. The URI requested by the client is longer than the server is willing to interpret.',
                message_ru: 'Ошибка. Запрошенный клиентом URI слишком длинный для того, чтобы сервер смог его обработать.',
                date: date,
                data: data,
            };
        case "415":
            return {
                status: 'Unsupported Media Type',
                code: code,
                message: 'Error. Unsupported Media Type. The media format of the requested data is not supported by the server, so the server is rejecting the request.',
                message_ru: 'Ошибка. Запрос отклонён, потому что медиа формат запрашиваемых данных не поддерживается сервером.',
                date: date,
                data: data,
            };
        case "416":
            return {
                status: 'Range Not Satisfiable',
                code: code,
                message: 'Error. Range Not Satisfiable. The ranges specified by the Range header field in the request cannot be fulfilled. It is possible that the range is outside the size of the target resources data.',
                message_ru: 'Ошибка. Сервер не может корректно обработать запрос с учётом диапазона, указанного в поле заголовка Range.',
                date: date,
                data: data,
            };
        case "417":
            return {
                status: 'Expectation Failed',
                code: code,
                message: 'Error. Expectation Failed. This response code means the expectation indicated by the Expect request header field cannot be met by the server.',
                message_ru: 'Ошибка. Сервер не может выполнить ожидание, указанное в поле заголовка запроса Expect.',
                date: date,
                data: data,
            };
        case "418":
            return {
                status: 'I am a teapot',
                code: code,
                message: 'Error. I am a teapot. The server refuses the attempt to brew coffee with a teapot.',
                message_ru: 'Ошибка. «Шуточный» ответ: сервер отклоняет попытку заварить кофе в чайнике.',
                date: date,
                data: data,
            };
        case "421":
            return {
                status: 'Misdirected Request',
                code: code,
                message: 'Error. Misdirected Request. The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.',
                message_ru: 'Ошибка. Сервер не может дать ответ. Возможно сервер не настроен для комбинации схемы и полномочий, указанных в URI запроса.',
                date: date,
                data: data,
            };
        case "422":
            return {
                status: 'Unprocessable Content',
                code: code,
                message: 'Error. Unprocessable Content (WebDAV). The request was well-formed but was unable to be followed due to semantic errors.',
                message_ru: 'Ошибка. Запрос сформирован правильно, но его невозможно выполнить из-за семантических ошибок.',
                date: date,
                data: data,
            };
        case "423":
            return {
                status: 'Locked',
                code: code,
                message: 'Error. Locked (WebDAV). The resource that is being accessed is locked.',
                message_ru: 'Ошибка. Запрашиваемый ресурс заблокирован.',
                date: date,
                data: data,
            };
        case "424":
            return {
                status: 'Failed Dependency',
                code: code,
                message: 'Error. Failed Dependency (WebDAV). The request failed due to failure of a previous request.',
                message_ru: 'Ошибка. Запрос не выполнен из-за проблем в предыдущем запросе.',
                date: date,
                data: data,
            };
        case "425":
            return {
                status: 'Too Early',
                code: code,
                message: 'Error. Too Early. Indicates that the server is unwilling to risk processing a request that might be replayed.',
                message_ru: 'Ошибка. Клиент отправил порцию данных слишком рано, до того как сервер установил безопасное соединение.',
                date: date,
                data: data,
            };
        case "426":
            return {
                status: 'Upgrade Required',
                code: code,
                message: 'Error. Upgrade Required. The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).',
                message_ru: 'Ошибка. Сервер отказывается выполнять запрос с использованием текущего протокола, но может быть готов сделать это после смены протокола на указанный в заголовке ответа Upgrade.',
                date: date,
                data: data,
            };
        case "428":
            return {
                status: 'Precondition Required',
                code: code,
                message: 'Error. Precondition Required. The origin server requires the request to be conditional. This response is intended to prevent the "lost update" problem, where a client GETs a resources state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.',
                message_ru: 'Ошибка. Сервер требует, чтобы запрос содержал условия. Этот ответ предназначен для предотвращения проблемы одновременного изменения ресурса несколькими пользователями.',
                date: date,
                data: data,
            };
        case "429":
            return {
                status: 'Too Many Requests',
                code: code,
                message: 'Error. Too Many Requests. The user has sent too many requests in a given amount of time (rate limiting).',
                message_ru: 'Ошибка. Пользователь отправил слишком много запросов в определённый промежуток времени.',
                date: date,
                data: data,
            };
        case "431":
            return {
                status: 'Request Header Fields Too Large',
                code: code,
                message: 'Error. Request Header Fields Too Large. The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.',
                message_ru: 'Ошибка. Сервер не будет обрабатывать запрос, потому что поля заголовка слишком велики. Запрос может быть отправлен повторно после уменьшения размера полей заголовка.',
                date: date,
                data: data,
            };
        case "451":
            return {
                status: 'Unavailable For Legal Reasons',
                code: code,
                message: 'Error. Unavailable For Legal Reasons. The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.',
                message_ru: 'Ошибка. Пользовательский агент запросил ресурс, который не может быть предоставлен по закону, например веб-страницу, подвергнутую цензуре со стороны правительства.',
                date: date,
                data: data,
            };
        
        /* ================== Server error responses (500-508, 510, 511) ================== */

        case "500":
            return {
                status: 'Internal Server Error',
                code: code,
                message: 'Error. Internal Server Error. The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.',
                message_ru: 'Ошибка. На сервере произошла ошибка, в результате которой он не может успешно обработать запрос.',
                date: date,
                data: data,
            };
        case "501":
            return {
                status: 'Not Implemented',
                code: code,
                message: 'Error. Not Implemented. The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.',
                message_ru: 'Ошибка. Метод запроса не поддерживается сервером и поэтому он не может быть обработан. Методы GET и HEAD должны всегда поддерживаться сервером и для них не должен возвращаться этот код.',
                date: date,
                data: data,
            };
        case "502":
            return {
                status: 'Bad Gateway',
                code: code,
                message: 'Error. Bad Gateway. This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.',
                message_ru: 'Ошибка. Такой ответ может прислать сервер, который выступает в качестве шлюза, если в процессе обработки запроса он получил недопустимый ответ от целевого сервера.',
                date: date,
                data: data,
            };
        case "503":
            return {
                status: 'Service Unavailable',
                code: code,
                message: 'Error. Service Unavailable. The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.',
                message_ru: 'Ошибка. Сервер не готов обработать запрос в данный момент. Распространёнными причинами являются техническое обслуживание или перегрузка сервера. Вместе с таким ответом следует отправлять удобную для пользователя страницу с объяснением проблемы, а также HTTP-заголовок Retry-After с расчётным временем решения проблемы. Кроме того, полезно отправлять заголовки с информацией о кешировании, поскольку эти временные ответы обычно не следует кэшировать.',
                date: date,
                data: data,
            };
        case "504":
            return {
                status: 'Gateway Timeout',
                code: code,
                message: 'Error. Gateway Timeout. This error response is given when the server is acting as a gateway and cannot get a response in time.',
                message_ru: 'Ошибка. Такой ответ может прислать сервер, который выступает в качестве шлюза, если в процессе обработки запроса он не может вовремя получить ответ от целевого сервера.',
                date: date,
                data: data,
            };
        case "505":
            return {
                status: 'HTTP Version Not Supported',
                code: code,
                message: 'Error. HTTP Version Not Supported. The HTTP version used in the request is not supported by the server.',
                message_ru: 'Ошибка. Используемая в запросе версия HTTP не поддерживается сервером.',
                date: date,
                data: data,
            };
        case "506":
            return {
                status: 'Variant Also Negotiates',
                code: code,
                message: 'Error. Variant Also Negotiates. The server has an internal configuration error: during content negotiation, the chosen variant is configured to engage in content negotiation itself, which results in circular references when creating responses.',
                message_ru: 'Ошибка. На сервере произошла внутренняя ошибка конфигурации: выбранный в процессе согласования вариант ресурса не является подходящим.',
                date: date,
                data: data,
            };
        case "507":
            return {
                status: 'Insufficient Storage',
                code: code,
                message: 'Error. Insufficient Storage (WebDAV). The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
                message_ru: 'Ошибка. Запрос не выполнен, потому что серверу не удалось сохранить данные.',
                date: date,
                data: data,
            };
        case "508":
            return {
                status: 'Loop Detected',
                code: code,
                message: 'Error. Loop Detected (WebDAV). The server detected an infinite loop while processing the request.',
                message_ru: 'Ошибка. Запрос не выполнен, потому что на сервере был обнаружен бесконечный цикл обработки данных.',
                date: date,
                data: data,
            };
        case "510":
            return {
                status: 'Not Extended',
                code: code,
                message: 'Error. Not Extended. The client request declares an HTTP Extension (RFC 2774) that should be used to process the request, but the extension is not supported.',
                message_ru: 'Ошибка. Для выполнения запроса необходимо его расширить.',
                date: date,
                data: data,
            };
        case "511":
            return {
                status: 'Network Authentication Required',
                code: code,
                message: 'Error. Network Authentication Required. Indicates that the client needs to authenticate to gain network access.',
                message_ru: 'Ошибка. Клиенту необходимо пройти аутентификацию для получения доступа к сети.',
                date: date,
                data: data,
            };
        default: 
            return {
                status: 'Unknown',
                code: null,
                message: 'Unknown.',
                message_ru: 'Неизвестно.',
                date: date,
                data: data,
            };
    };
};

module.exports = returns;
