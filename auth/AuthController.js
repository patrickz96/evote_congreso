var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

//router.use(bodyParser.urlencoded({ extended: false }));
//router.use(bodyParser.json());
var User = require('../models');
const models = require('../models');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config/config.js'); // get config file

/*
router.get('/', function(req, res){
  console.log("DENTRANDO A REGISTRO");
  var status = req.session.status;
  var msg = req.session.msg ;
  req.session = null;
  res.render('/admin/index', {status: status, message: msg });
});
*/

router.get('/', function(req, res) {
  var status = req.session.status;
  var msg = req.session.msg ;
  req.session = null;
  res.render('./admin/index', { title: 'EvotePanel', status: status, message: msg });
});


router.post('/login', function(req, res) {

  console.log("BODY LOGIN");
  console.log(req.body);

  
  models.supervisor.findOne({
    where: {
      username: req.body.username
    }, returning: true,
    plain: true
  }).then(data =>{
      console.log("DATA");
      console.log(data);
      //if(data.length==0) return res.status(404).send("No supervisor found.");
      if(data==undefined){
        //console.log("error1");
        req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
        return res.redirect("/admin");
      } 

      
      //console.log(data.password);
      //console.log(data.username);
      // check if the password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
      if (!passwordIsValid){
        req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
        return res.redirect("/admin");
      }
      //return res.status(401).send({ auth: false, token: null });

      var token = jwt.sign({ id: data.id,username:data.username }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
  
      //for my browser
      res.header('x-access-token', [token]);
      res.cookie('EvoteToken', token);
      //res.status(200).send({ auth: true, token: token });
      res.redirect("/admin/panel");

  }).catch(err=>{
    return res.status(500).send("There was a problem finding supervisor. "+err);
  });
  

});



router.get('/logout', function(req, res) {
  res.clearCookie("EvoteToken");
  //res.status(200).send({ auth: false, token: null });
  res.redirect("/admin");
});


router.get('/register', function(req, res){

    console.log("DENTRANDO A REGISTRO");
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/register', {status: status, message: msg });   
});




router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  //var hashedPassword = bcrypt.hashSync("12345", 8);

  console.log("saving new supervisor");
  models.supervisor
  .create({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    
  })
  .then(data => {
      console.log("GUARDANDO USUARIO");
      console.log(data);
      /*
      var token = jwt.sign({ id: data.id,name:data.name }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      */
      //res.header('x-access-token', [token]);
      
      //res.cookie('EvoteToken', token)
      //res.status(200).send({ auth: true, token: token });

      req.session.status = "ok";
      req.session.msg =  "USUARIO: "+data.username+" REGISTRADO COMO "+data.name;
      res.redirect('/admin/register');


      //res.status(200).send(data);
  })
  .catch(err => {
      return res.status(500).send("There was a problem adding the information to the database. "+err);
  });
  
  /*
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  },*/

  /*
  User.create({
    name : "juan",
    email : "juan@mail.com",
    password : hashedPassword
  }, 
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user`.");

    // if user is registered without errors
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    //res.header('x-access-token', [token]);
    res.cookie('mytoken', token)
    res.status(200).send({ auth: true, token: token });
  });*/

});

/*
router.get('/me', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});
*/
module.exports = router;