var express = require('express');
var router = express.Router();
const conexion = require('./../database/mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

conexion.query('SELECT 1 + 1 AS solution', (error, results, fields)=>{
  if (error) {
    throw error;
  }
  console.log('the solution is: ', results[0].solution);
});
module.exports = router;
