
//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');



//CREATE HTTP SERVER
var httpServer = http.createServer(function(req,res){

    unifiedServer(req,res);

});



var httpsServerOptions = {
    'key':fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}




//CREATE HTTPS SERVER
var httpsServer = https.createServer(httpsServerOptions,function(req,res){

    unifiedServer(req,res);

});

var unifiedServer = function(req,res){

    var parsedUrl = url.parse(req.url,true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    var method = req.method.toLowerCase();
    var queryStringObject = parsedUrl.query;
    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data',function (data){
        buffer += decoder.write(data);
    } );

    req.on('end',function (){
        buffer += decoder.end();

        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath':trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        }

        choosenHandler(data,function (statusCode,payload) {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {} ;

            var payloadString = JSON.stringify(payload);

            res.setHeader("Content-Type","application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log("Returning this response : ",statusCode,payloadString);
        })


    })



}


//LISTEN HTTP SERVER
httpServer.listen(config.httpPort,function () {

    console.log("Server up on port: "+config.httpPort);
})


//LISTEN HTTPS SERVER
httpsServer.listen(config.httpsPort,function () {

    console.log("Server up on port: "+config.httpsPort);
})





var router = {
    'ping': handlers.ping,
    'users': handlers.users
}


