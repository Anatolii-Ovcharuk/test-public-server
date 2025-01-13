/* "Hook Generator ID", v. 1.2 - 01.01.2025 | MIT License | Made by Anatolii Ovcharuk - https://github.com/Anatolii-Ovcharuk */
/* Description: Generator ID Hook for React Component. */

    /* INSTALLATION */
/* Use this line for install in JS: const runGenId = require("./GeneratorID_v.1.2"); ; */
/* Call function for recive id: 
1. Default run: runGenId()
2. Custom run: runGenId(*numbers*, *true/false*, *true/false*, *true/false*). 
Example: runGenId(6, true, false, false) - ( total generated numbers in ID, include date in ID code, include special numbers of date, include special numbers length of date ) */

require('colors');

    /* DEFAULT OPTIONS */
const TEST = false; /* Enable or disable Test */
const USE_DATE = true; /* Include for Default in ID code date (true / false). */
const INCLUDE_DATENOW = false; /* Include for Default in ID code special numbers of date (true / false). */
const INCLUDE_DATENOW_LENGTH = false; /* Include for Default in ID code special numbers length of date (true / false). */
const GENERATE_NUMBER = 6; /* Change for Default ammount generated numbers in ID (Default and stable: 6) */

/* ========================== Variables ========================== */

let id = "";

/* ========================== Function ========================== */

function runGenId(GEN_NUM = GENERATE_NUMBER, GEN_DATE = USE_DATE, GEN_DATENOW = INCLUDE_DATENOW, GEN_DATENOW_LENGTH = INCLUDE_DATENOW_LENGTH) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetterFirst = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetterSecond = alphabet[Math.floor(Math.random() * alphabet.length)];
    let randomNumbers = "";

    let i = null;    
    for (i = 0; i < GEN_NUM; i += 1) { 
        randomNumbers = randomNumbers + Math.floor(Math.random() * (9 - 1) + 0).toString();
    };
    // console.log(`Total generate numbers: ${i}`);

    let year = "";
    let month = "";
    let date = "";

    if (GEN_DATE) {
        year = (new Date).getFullYear().toString();
        month = ((new Date).getMonth() + 1).toString();
        if (month.length === 1) {
                month = "0" + month;
            };
        date = (new Date).getDate().toString();
        if (date.length === 1) {
                date = "0" + date;
            };
    }

    id = `${randomNumbers + randomLetterFirst + i + randomLetterSecond + year + month + date}`
    
    if (GEN_DATENOW) {
        const randomLetterThird = alphabet[Math.floor(Math.random() * alphabet.length)];
        id = id + randomLetterThird + (Date.now()).toString();
    }

    if (GEN_DATENOW_LENGTH) {
        const randomLetterFourth = alphabet[Math.floor(Math.random() * alphabet.length)];
        id = id + randomLetterFourth + (Date.now()).toString().length;
    }

    // console.log(`ID: ${id}`);
    return id;
};

/* ========================== Module Export ========================== */
    
// export default runGenId;
module.exports = runGenId;

/* ========================== Test Modules ========================== */

if (TEST) {
console.log("Test ID enabled.".yellow)
    /* Test */
console.log(("Test ID: " + runGenId(3, true, true, true)).yellow);
} else { console.log("Test ID disabled.".yellow) };
