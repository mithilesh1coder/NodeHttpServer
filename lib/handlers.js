var _data = require('../lib/data');
var helpers = require('./helpers');

var handlers = {};

handlers.ping = function (data,callback) {

    callback(200);

}

handlers.notFound = function (data,callback) {

    callback(404);

}


handlers.users = function(data,callback){

    var acceptableMethods = ['post','get','put','delete'];

    if(acceptableMethods.indexOf(data.method) > -1){

        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
}


handlers._users = {};

handlers._users.post = function(data,callback){

    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement === true ? true: false;

    if(firstName && lastName && phone && password && tosAgreement){

        _data.read('users',phone,function (err,data) {

            if(err){
               var hashedPassword = helpers.hash(password);

               if(hashedPassword){

                   var userObj = {
                       'firstName' : firstName,
                       'lastName' : lastName,
                       'phone' : phone,
                       'hashedPassword' : hashedPassword,
                       'tosAgreement' : true
                   }

                   _data.create('users',phone,userObj,function (err) {

                       if(!err){
                           callback(200);
                       }
                       else
                       {
                           console.log(err);
                           callback(500,{'Error':'Could not add user'})
                       }
                   })
               }
               else{
                   callback(500,{'Error':'Could not hash password'})
               }

            }
            else {
                callback(400,{'Error':'A user already exists'});
            }
        })
    }
    else
    {
        callback(400,{'Error':'Please fill required fields'});
    }
}

handlers._users.get = function(data,callback){

    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false;

    if(phone){
      _data.read('users',phone,function (err,data) {

          if(!err && data){

              delete data.hashedPassword;
              callback(200,data);

          }else
          {
              callback(404);
          }
      })
    }
    else
    {
        callback(400,{'Error':'Missing required fields'});
    }
}

handlers._users.put = function(data,callback){

    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;

    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone){

        if(firstName || lastName || password){

            _data.read('users',phone,function (err,userData) {

                if(firstName){
                    userData.firstName = firstName;
                }
                if(lastName){
                    userData.lastName = lastName;
                }
                if(password){
                    userData.hashedPassword = helpers.hash(password);
                }

                _data.update('users',phone,userData,function (err) {

                    if(!err){
                        callback(200);
                    }
                    else
                    {
                        console.log(err);
                        callback(500,{'Error':'Could not update data'});
                    }
                })
            })

        }
        else
        {
            callback(400,{'Error':'Missing fields to update'});
        }
    }
    else
    {
        callback(400,{'Error' :'Missing required fields'});
    }


}

handlers._users.delete = function(data,callback){

    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false;

    if(phone){
        _data.read('users',phone,function (err,data) {

            if(!err && data){
               _data.delete('users',phone,function (err) {

                   if(!err){
                       callback(200);
                   }
                   else
                   {
                       callback(500,{'Error':'Could not delete user'})
                   }
               })

            }else
            {
                callback(404,{'Error':'Could not find user'});
            }
        })
    }
    else
    {
        callback(400,{'Error':'Missing required fields'});
    }

}


handlers.tokens = function(data,callback){

    var acceptableMethods = ['post','get','put','delete'];

    if(acceptableMethods.indexOf(data.method) > -1){

        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
}


handlers._tokens = {};

handlers._tokens.get = function(data,callback){

    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone && password){

        _data.read('users',phone,function (err,userData) {

            if(!err && userData){
                var hashedPassword = helpers.hash(password);

                if(hashedPassword == userData.hashedPassword){

                    var tokenId = helpers.createRandomString(20);

                    var expires = Date.now() + 1000*60*60;

                    var tokenObj = {
                        'phone': phone,
                        'id': tokenId,
                        'expires':expires
                    }

                    _data.create('tokens',tokenId,tokenObj,function (err) {
                        if(!err){
                            callback(200,tokenObj);
                        }
                        else
                        {
                            callback(500,{'Error':'Could not create new token'});
                        }

                    })
                }
                else{
                    callback(400,{'Error':'Password did not match with the specified users'})
                }

            }
            else{
                callback(400,{'Error' : 'Could Not find Specified user'});
            }
        })

    }
    else{
        callback(400,{'Error' : 'Missing required fields'})
    }

}


handlers._tokens.post = function(data,callback){

}


handlers._tokens.put = function(data,callback){

}


handlers._tokens.delete = function(data,callback){

}



module.exports = handlers;
