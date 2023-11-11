const puppeteer = require('puppeteer');
const axios     = require('axios');

const {getInbox, generateEmails} = require("./mail");


const url = "https://www.okx.com/account/register";

(async () => {
    console.log('Code Execution starting')
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    // Set a slower typing speed (e.g., 100 milliseconds delay between key presses)
    const options = { delay: 200 };

    await page.goto('https://www.okx.com/account/register');

    // Wait for the element with the class "login-tabs-pane-list-container" to appear
    await page.waitForSelector('.login-tabs-pane-list-flex-shrink');

    // Check if the element exists on the page using page.$eval
    const elementExists = await page.$eval('.login-tabs-pane-list-flex-shrink', (element) => {
        return element && element.children.length > 1 ;
    });

    if (elementExists) {
        //Clicking the Email tab
        await page.evaluate(() => {
            const elements = document.getElementsByClassName('login-tabs-pane-list-flex-shrink')[0].children;
            elements[1].click();
        });
    }else{
        debugger; // Execution will pause here
    }

    // Type text into the input field
    // Use page.evaluate to execute your JavaScript code in the browser context
    await page.evaluate(() => {
        const inputElement = document.getElementsByClassName('login-input-box account-input-wrapper')[0].children[1];

        // Check if the input element is found
        if (inputElement) {
        // Focus on the input field
        inputElement.focus();
        }
    });

    let email = await generateEmails("1213042891msh4facd5f4907639fp137aa2jsn06db633587a0", 1);
    // Type text into the input field using page.keyboard
    await page.keyboard.type(email[0], options);


    // Trigger a blur event to focus out (simulate user clicking outside)
    await page.evaluate(() => {
        const inputElement = document.getElementsByClassName('login-input-box account-input-wrapper')[0].children[1];
        if (inputElement) {
        const blurEvent = new Event('blur', { bubbles: true });
        inputElement.dispatchEvent(blurEvent);
        }
    });

    //Move mouse like a human
    await moveMouseRandomly(page, '#register-submit-btn');

    // Click the submit button with the id "register-submit-btn"
    await page.click('#register-submit-btn');

    await waitTime(60000);

    // Check if the element with class "verify-input-container" is now on the page
    const verifyInputContainerExists = await page.$('.verify-input-container');
    const RAPIDAPIKEY = "1213042891msh4facd5f4907639fp137aa2jsn06db633587a0" ;

    if (verifyInputContainerExists) {
        // GET and type in Verification code
        await waitTime(5000)
        let verificationCode = await getEmailVerificationCode(email[0], RAPIDAPIKEY);

        if(!verificationCode || String(verificationCode).length < 6 ){
            await waitTime(7000)
            verificationCode = await getEmailVerificationCode(email[0], RAPIDAPIKEY);
        }
        if(!verificationCode || String(verificationCode).length < 6 ){
            await waitTime(10000)
            verificationCode = await getEmailVerificationCode(email[0], RAPIDAPIKEY);
        }
        if(!verificationCode || String(verificationCode).length < 6 ){
            throw new Error("Failure retrieving Verification Code")
        }

        verificationCode = ''+verificationCode;

        const codeSections = await page.$$('.code-section');

        for (let i = 0; i < codeSections.length; i++) {
            const inputElement = await codeSections[i].$('input[type="tel"]');
            // Type the digit into the input field
            await inputElement.type(verificationCode.slice(i,i+1), options);
        }
    }

    // Checking if it requests a MOBILE NUMBER
    await page.evaluate(() => {
        const numberSection = document.getElementsByClassName('index_title__TWFEF')[0].innerHTML.includes('Verify');
        
        if(numberSection){
            throw new Error('Page Requesting Phone Number')
        }
    });
    
    await page.evaluate(() => {
        const inputElement = document.getElementsByClassName('login-select-value-box')[0].children[0];
        inputElement.click();

        const searchEl = document.getElementsByClassName('login-select-search')[0].children[0].children[2];
        searchEl.focus();

    });

    let country = 'Vietnam';
    // Type text into the input field using page.keyboard
    await page.keyboard.type(country, options);

    await page.evaluate(() => {
        const countrySel = document.getElementsByClassName('login-select-item')[0];
        countrySel.click();

        const checkbox = document.getElementsByClassName('login-checkbox-input')[0]
        checkbox.click();
    });

    // Click the Next button
    await page.click('#register-country-submit');

    // Clicking confirm on Dialog box
    await page.evaluate(() => {
        const confirmDialog = document.getElementsByClassName('login-dialog-btn-box')[0].children[1];
        confirmDialog.click();
    });


    // Creating Password
    document.getElementsByClassName("password-inner-wrapper")[0].children[0]
    await page.evaluate(() => {
        const passwordInput = document.getElementsByClassName("password-inner-wrapper")[0].children[0];
        passwordInput.focus();
    });

    let password = 'Vietnam';
    // Type text into the input field using page.keyboard
    await page.keyboard.type(password, options);

    // Click the Next button
    await page.click('#register-submit');


    await browser.close();
    saveToSheets(email, password, url, country);
    console.log('Code execution ended!')

 })();


 function saveToSheets(email, password, url, country){
    // Saving File to Googlesheets
    const sheetURL = "https://script.google.com/macros/s/AKfycbyaqL7cM6iSbLXlodLSQI3Qae7-24cX6zmFpPzQYsBD9pHNop9LL4w7Z7L8RtMtv7-jHg/exec";
    axios.post(sheetURL,JSON.stringify({email, password, url, country}),{headers: {"Content-Type": "application/json"}})
        .then((res) => {  })
        .catch((error) => {throw new Error(error);});
}

 const getEmailVerificationCode = async (email, RAPIDAPIKEY) => {
    try {
      const verificationCode = await getInbox(email, RAPIDAPIKEY);
      return Number(verificationCode);
    } catch (error) {
      return false;
    }
  };


const isNumber = (variable) => typeof variable === 'number';


// Function to generate a random number within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    

// Function to simulate human-like mouse movement
async function moveMouseRandomly(page, buttonSelect) {
    const buttonSelector = buttonSelect; // Replace with your button selector

    // Get the button's bounding box to determine its position
    const buttonBoundingBox = await page.$eval(buttonSelector, (button) => {
      const { x, y, width, height } = button.getBoundingClientRect();
      return { x, y, width, height };
    });

    // Move the mouse around the button in a random manner
    for (let i = 0; i < 10; i++) { // Adjust the number of movements as needed
      const randomX = buttonBoundingBox.x + getRandomInt(0, buttonBoundingBox.width);
      const randomY = buttonBoundingBox.y + getRandomInt(0, buttonBoundingBox.height);

      await page.mouse.move(randomX, randomY);
      await page.waitForTimeout(getRandomInt(50, 200)); // Add a delay between movements
    }
}


function waitTime(time){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('');
        }, time)
    })
}