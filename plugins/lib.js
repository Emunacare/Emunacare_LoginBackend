const fp = require('fastify-plugin');
const axios = require('axios');
const _ = require('lodash');

const jwt = require('jsonwebtoken');

function Lib() {

  this.containsText = function containsText(strFull, strPart) {
    const strFullTrimmed = String(strFull).replace(/[^0-9a-zA-Z]+/g, '').toLowerCase();
    const strPartTrimmed = String(strPart).replace(/[^0-9a-zA-Z]+/g, '').toLowerCase();
    return strFullTrimmed.indexOf(strPartTrimmed) >= 0;
  };

  this.equalsText = function equalsText(str1, str2) {
    const first = String(str1).replace(/[^0-9a-zA-Z]+/g, '').toLowerCase();
    const second = String(str2).replace(/[^0-9a-zA-Z]+/g, '').toLowerCase();
    return first === second;
  };

  this.isJsonObject = function isJsonObject(strData) {
    try {
      if (typeof strData === "string")
        JSON.parse(strData);
      else
        return typeof strData === "object"
    } catch (e) {
      return false;
    }
    return true;
  }
  this.generateQRCode =function generateQRCode(data) {
    return Buffer.from(data).toString('base64');
  }
  
   this.encrypt = function encrypt(password) {
    try {
        const encodedPassword = Buffer.from(password).toString('base64');
        return encodedPassword;
    } catch (error) {
        console.error(error);
        return password;
    }
};

this.decrypt = function decrypt(encodedPassword) {
    try {
        const decodedPassword = Buffer.from(encodedPassword, 'base64').toString('utf8');
        return decodedPassword;
    } catch (error) {
        console.error(error);
        return encodedPassword;
    }
};

  this.removeEmptyValues = function removeEmptyValues(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        }
      }
    }
    return obj;
  }

  this.returnMessage = function returnMessage(msg, code) {
    return {
      message: msg,
      code: code
    }
  }

  this.getGeocode = async function getGeocode(address) {
    try {
      const locationIQUrl = `${process.env.LOCATION_IQ_MAP_URL}?key=${process.env.LOCATION_IQ_MAP_KEY}&q=${encodeURIComponent(address)}&format=json`;
      const response = await axios.get(locationIQUrl);
      if (response.status === 200) {
        const { lat, lon } = response.data[0];
        return { latitude: lat, longitude: lon };
      } else {
        return 'Failed to fetch coordinates.';
      }
    } catch (error) {
      console.error(error);
      return error;
    }

  }
  this.getToken = async function getToken(key, object) {
    const token = jwt.sign(object, key);
    return token;
  }

  this.retreiveToken = async function retreiveToken(key, token) {
    const decoded = jwt.verify(token,key);
    return(decoded);
  }

  this.getDistance = async function getDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; 
    const milesPerKilometer = 0.621371; 
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;
  
   
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c; // Distance in kilometers
  
    // Convert kilometers to miles
    const distanceMiles = distanceKm * milesPerKilometer;
  
    return Math.round(distanceMiles);
  }  
  this.checkObjectIsEqual = function checkObjectIsEqual(obj, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }  
  this.objectsAreEqual = function objectsAreEqual(obj1, obj2) {
    return _.isEqual(obj1, obj2);
  }
}
module.exports = fp(async (fastify, opts) => {
  fastify.decorate('lib', new Lib());
});
