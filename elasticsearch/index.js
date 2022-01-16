const client = require('../config/connection')


function ping(){
    client.ping((error) => {
        if (error) {
          console.trace('elasticsearch cluster is down!');
        } console.log('All is well');
      });

}

ping();
var delete_ = false
var indexName_ = "activedirectory"

var body = {
  
    properties:{
        PSComputerName: {'type': 'text'},
        RunspaceId: {'type': 'text'},
        PSShowComputerName: {'type': 'boolean'},
        DistinguishedName: {'type': 'text'},
        Enabled: {'type': 'boolean'},
        GivenName: {'type': 'text'},
        Name: {'type': 'text'},
        ObjectClass: {'type': 'text'},
        ObjectGUID: {'type': 'text'},
        SamAccountName: {'type': 'text'},
        SID: {'type': 'text'},
        Surname: {'type': 'text'},
        UserPrincipalName: {'type': 'text'}
    }
    
}


async function createMapping(indexName, body){

    client.indices.putMapping({  
        index: indexName,
        body: body,
        
      },function(err,resp,status){
          if (err) {
            console.log(err);
          }
          else {
            console.log(resp);
          }
      });
    

}

async function createIndex(indexName, cb){


    client.indices.create({
    index:indexName,},
    function(err,resp,status){
        if (err) {
        console.log(err);
    
        }
        else {
        console.log(resp);
        cb()
        }
    });
    

}

function deleteIndex(indexName){


    client.indices.delete({
    index:indexName},
    function(err,resp,status){
        if (err) {
        console.log(err);
        }
        else {
        console.log(resp);
        }
    });
    

}

function indexExist(indexName, body){
    
        client.indices.exists({index: indexName}, function(err, resp){
         if (err) {
          console.log(err);
          return;
         }
       
         if (!resp) {
          console.log(indexName + ' does not exist');
          createIndex(indexName, function (){
            createMapping(indexName, body);
          });
          
         }
         else {
        
          console.log(indexName + ' already exists');
          
         }
        });
     

}


function push(indexName, body, cb){

    client.index({  
        index: indexName,
        body: body
    },function(err,resp,status) {
        console.log(resp);
        cb(resp);
    });

}


if(delete_){
    deleteIndex(indexName_)
}else{

    indexExist(indexName_, body);
}


module.exports = {
    push
}