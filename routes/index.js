const routes = require('express').Router();

var AD = require('../ad.js') 

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


routes.get('/getuser', (req, res) => {

AD.GetUser("*", "UserPrincipalName", function (users){
  
  res.send(users)
})


});


module.exports = routes;