var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

var User = require('../models');
const models = require('../models');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config/config.js'); // get config file

router.get('/', function(req, res) {
  var status = req.session.status;
  var msg = req.session.msg ;
  req.session.status = undefined;
  req.session.msg = undefined;
  res.render('./admin/index', { title: 'EvotePanel', status: status, message: msg });
});


router.post('/login', function(req, res) {
  models.supervisor.findOne({
    where: {
      username: req.body.username
    }, returning: true,
    plain: true
  }).then(data =>{
      if(data==undefined){
        req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
        return res.redirect("/admin");
      } 
      var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
      if (!passwordIsValid){
        req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
        return res.redirect("/admin");
      }
      var token = jwt.sign({ name: data.name,username: data.username,rol: data.rol }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      //for my browser
      res.header('x-access-token', [token]);
      res.cookie('EvoteToken', token);
      res.redirect("/admin/panel");

  }).catch(err=>{
    return res.status(500).send("There was a problem finding supervisor. "+err);
  });
});

router.get('/register', function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session.status = undefined;
    req.session.msg = undefined;
    res.render('./admin/register', {status: status, message: msg });   
});

router.post('/register', function(req, res) {
  console.log(req.body);
  
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  models.supervisor
  .create({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      rol: req.body.rol
  })
  .then(data => {
      req.session.status = "ok";
      req.session.msg =  "USUARIO: "+data.username+" REGISTRADO COMO "+data.name;
      res.redirect('/admin/register');
  })
  .catch(err => {
      return res.status(500).send("There was a problem adding the information to the database. "+err);
  });
});

router.get('/logout', function(req, res) {
  res.clearCookie("EvoteToken");
  res.redirect("/admin");
});


router.get('/get_info_user',VerifyToken,  function(req,res){

  var token = req.cookies['EvoteToken'];
    // verifies secret and checks exp
  jwt.verify(token, config.secret, async function(err, decoded) {      
  if (err) 
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
  else{
    res.status(200).send({name: decoded.name, username: decoded.username,rol: decoded.rol });
      /*          
      var company  = await models.company.findOne({where:{id:decoded.id_company}}).then(obj=>{if(obj){return obj;}else{return null;}});
      if(company==null){
        //req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
        //return res.redirect("/");
        res.status(200).send({username: decoded.username, id_company: decoded.id_company});
      }
      else{
        res.status(200).send({username: decoded.username, id_company: decoded.id_company,company_name:company.name});
      }*/
  }
   
  // if everything is good, save to request for use in other routes
  //next();
  });
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