var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next)=>{
  const object = { name : req.body.name,
    lastname : req.body.lastname, 
    username : req.body.username, 
    email : req.body.email, 
    password : req.body.password
  }
  console.log(object);
  res.send('hello');
});

module.exports = router;
