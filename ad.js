const Shell = require('node-powershell');

var es = require('./elasticsearch/index')

const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

var username  = ''
var hostname = ''
var remote = true



function InitCo(cb){
  //Create Session and store it in variable
  ps.addCommand(`$session = New-PSSession -HostName ${hostname} -UserName ${username}`);
  //Import AD Module in the session
  ps.addCommand(`Invoke-Command $session -ScriptBlock {$ProgressPreference = 'SilentlyContinue'; Import-Module activedirectory}`);
  ps.invoke()
  .then(output => {

    //console.log(output);
    cb();
  })
  .catch(err => {
    console.log(err);
  });

}


function AddCommand(command,cb){
    
    ps.addCommand(command);

    ps.invoke()
    .then(output => {
       cb(output);
    })
    .catch(err => {
      console.log(err);
    });

}

function GetUser(filters, attribute, cb){

  if(remote){
    InitCo(function(){
      AddCommand(`Invoke-Command $session -ScriptBlock {$ProgressPreference = 'SilentlyContinue'; Get-ADUser -Filter ${filters} | Select-Object ${attribute} | ConvertTo-Json }`, function (output){
        cb(output);
      });

    })
  }else{
    AddCommand(`$ProgressPreference = 'SilentlyContinue'; Get-ADUser ${filters} | Select-Object ${attribute}  | ConvertTo-Json `);

  }

}


function update_user(cb){

  GetUser("*", "*", function (users){

  
    for( var user of users){
      console.log(user)
    }

    // es.push("activedirectory", users, function (output){
     
    //   cb(output)
    // })


  })
 
 }
 


module.exports = {
  update_user
};






