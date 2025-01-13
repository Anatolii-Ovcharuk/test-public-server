/* "Request form", v. 0.2 - 30.12.2024 | MIT License | Made by Anatolii Ovcharuk - https://github.com/Anatolii-Ovcharuk */
/* Description: This is a JS File for Node.js. */

    /* OPTIONS */
const DEFAULT_LOCALE = 'en-GB'; /* For Date - Locale is explicitly set (must be in string):
en-US - US English uses month-day-year order and 12-hour time with AM/PM.
en-GB - British English uses day-month-year order and 24-hour time without AM/PM.
ko-KR - Korean uses year-month-day order and 12-hour time with AM/PM.
ar-EG - Arabic in most Arabic-speaking countries uses Eastern Arabic numerals.
ja-JP-u-ca-japanese - For Japanese, applications may want to use the Japanese calendar, where 2012 was the year 24 of the Heisei era.
["ban", "id"] - When requesting a language that may not be supported, such as Balinese, include a fallback language (in this case, Indonesian)
*/

    /* INSTALLATION */
/* Add in JS script: const requestform = require('./RequestForm_v.0.2'); 
Call full functions: requestform(request, *date*);
Call default functions: requestform(request); */

function requestform(request, date = (new Date()).toLocaleString(DEFAULT_LOCALE).replaceAll("/", ".")) {
    const datareq = {
        url: request.url,
        method: request.method,
        body: request.body || null,
        query: request.query, // Data in {?}
        params: request.params, // Data in {:value}
        headers: request.headers,
        date: date,
    };
    return datareq;
};

module.exports = requestform;
