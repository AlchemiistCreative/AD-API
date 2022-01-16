const routes = require('express').Router();

var AD = require('../ad.js') 

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


routes.get('/update', (req, res) => {

AD.update_user(function (results){
res.send(results)
})


});


module.exports = routes;