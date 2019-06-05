
var crypto = require('crypto');
var config = require('./config');




helpers = {};


helpers.hash = function (str) {
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
}

helpers.parseJsonToObject = function (str) {

    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch (e) {
       return  {};
    }
}


helpers.createRandomString = function(strLength){

    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false ;

    if(strLength){
        var possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        var str = '';

        for(var i = 1 ; i <= strLength ; i++){

            var randomCharacter = possibleChars.charAt(Math.floor(Math.random()*possibleChars.length));

            str = str+randomCharacter;

        }

        return str;
    }

    else{
        return false;
    }
}


module.exports = helpers;
