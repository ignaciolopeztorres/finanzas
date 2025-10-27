var express = require('express');
var router = express.Router();
const pool = require('../core/database/mysql');

//CONFIGURACION
const {
  APP_NAME,
  APP_IMG_URL,
  APP_CSS_URL
} = require('../core/settings/config');

/* GET users listing. */
router.get('/', function (req, res, next) {
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
  res.send('hello!!');
});

conexion.query('SELECT 1 + 1 AS solution', (error, results, fields)=>{
  if (error) {
    throw error;
  }
  console.log('the solution is: ', results[0].solution);
});
module.exports = router;
router.get('/register', (req, res, next) => {
  res.render('admin/register', {
    title: APP_NAME,
    logo_img: APP_IMG_URL + 'develop.jpg',
    APP_CSS_URL
  });
});

router.post('/register', (req, res, next) => {
  const {
    username,
    password,
    fullname,
    email
  } = req.body;
  // console.log(req.body);
  const query = "INSERT INTO users(username, password, fullname, email) VALUES (?,?,?,?)";
  pool.query(query, [username, password, fullname, email], function (error, results, fields) {
    if (error) throw error;
    //console.log('The solution is: ', results[0].solution);
  });

  res.status(201).redirect('login/');

});

/** GET login
 */
router.get('/login', (req, res, next) => {
  res.status(200).render('admin/index', {
    title: APP_NAME,
    logo_img: APP_IMG_URL + 'develop.jpg',
    APP_CSS_URL
  });
});

/* POST login*/
router.post('/login', function (req, res, next) {
  console.log('request: ', req.body);
  res.status(200).send('succesfull');
});

module.exports = router;
