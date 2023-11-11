const axios      = require('axios');
const crypto    = require('crypto');

/**
 * Makes GET request
 * @param {string} url
 * @returns {Promise}
 */
function get(path, RAPIDAIPkey) {

  return new Promise((resolve, reject) => {
    
    axios({
      method: "get",
      url:`https://privatix-temp-mail-v1.p.rapidapi.com/${path}`,
      headers: {
        'X-RapidAPI-Key': RAPIDAIPkey,
        'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com'
      }
    }).then((response) =>{
      resolve(response.data)
    }).catch( (error) => {
      reject(error)
    })

  })
  
}

/**
 * Generates MD5 hash from email
 * @param {string} email
 * @returns {string}
 */
function getEmailHash(email) {
    return crypto.createHash('md5').update(email).digest('hex');
  }

/**
 * Receives available domains
 * @returns {Promise.<Array, Error>}
 */
function getAvailableDomains(RAPIDAIPkey) {
  return get('request/domains/', RAPIDAIPkey);
}


/**
 * Generates random email in given domains
 * @param   {Array}  domains
 * @param   {Number} mailNumbers
 * @returns {Array} 
**/
function getRandomEmail(domains, mailNumbers) {
  const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
  let emailContainer = [];

  for(let a= 0; a<mailNumbers; a++){
    let name = '';
    for (let i = 0; i < [6,7,8,9][Math.floor(Math.random() * 4)]; i++) {
        const randomChar = Math.round(Math.random() * (alphabet.length - 1));
        name += alphabet.charAt(randomChar);
    }
    const domain = domains[Math.floor(Math.random() * domains.length)];
    emailContainer.push(name + domain);
  }
  return emailContainer;
}

/**
 * Generates email on temp-mail.ru
 * @param {number} mailNumbers
 * @param {string} prefix
 * @returns {Promise.<String, Error>}
 */
exports.generateEmails = (RAPIDAIPkey, mailNumbers) => {
  return getAvailableDomains(RAPIDAIPkey)
    .then(availableDomains => {
      return getRandomEmail(availableDomains, mailNumbers)
    })  
}

/**
 * Receives inbox from temp-mail.ru
 * @param {string} email
 * @returns {Promise.<(Object|Array), Error>}
 */
exports.getInbox = async(email, RAPIDAPIKEY) => {
    return get(`request/mail/id/${getEmailHash(email)}/`,RAPIDAPIKEY)
    .then( data => {
      const text = data[0]['mail_text'];
      const regex = /\b\d{6}\b/;
      let verificationCode = text.match(regex);
      verificationCode = verificationCode[0]
      return verificationCode;
    })
}

const getEmailVerificationCode = async (email, RAPIDAPIKEY) => {
  try {
    const verificationCode = await this.getInbox(email, RAPIDAPIKEY);
    return Number(verificationCode);
  } catch (error) {
    return new Error("Failed to retrieve Number");
  }
};

