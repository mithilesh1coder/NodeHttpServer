var fs = require('fs');
var path = require('path');



var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');



lib.create = function (dir,file,data,callback) {

    var filepath = lib.baseDir+dir+'\\'+file+'.json';
    fs.open(filepath,'wx',function (err,fileDescriptor) {

        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor,stringData,function (err) {
                if(!err){

                    fs.close(fileDescriptor,function (err) {
                      if(!err)  {
                          callback(false);
                      }else{
                          callback("Error closing the file");
                      }
                    })
                }else {
                    callback('Error writing to a new file');
                }
            })

        }
        else {
            callback("Could not create file , it may already exist",err);

        }
    })
    
}

lib.read = function(dir,file,callback){
     fs.readFile(lib.baseDir+dir+'\\'+file+'.json','utf-8',function (err,data) {

         if(!err && data){
             var parsedData = helpers.parseJsonToObject(data);
             callback(false,parsedData);
         }
         else{
             callback(err,data);
         }

     })
}


lib.update = function(dir,file,data,callback){

    fs.open(lib.baseDir+dir+'\\'+file+'.json','r+',function (err,fileDescriptor) {

        if(!err && fileDescriptor){

            var stringData = JSON.stringify(data);

            fs.truncate(fileDescriptor,function (err) {
                
                if(!err){
                    
                    fs.writeFile(fileDescriptor,stringData,function (err,) {

                        if(!err){
                            fs.close(fileDescriptor,function (err) {

                                if(!err){
                                    callback(false);
                                }
                                else
                                {
                                    callback('Error closing the file')
                                }
                            })
                        }
                    })
                }
                else{
                    console.log('Error truncating file');
                }
            })
        }
        else{
            console.log('Could not open the file it may not exist');
        }
    })
}


lib.delete = function(dir,file,callback){

    fs.unlink(lib.baseDir+dir+'\\'+file+'.json',function (err) {

        if(!err){
            callback(false);
        }
        else{
            callback('Error deleting file');
        }
    })
}
module.exports = lib;
