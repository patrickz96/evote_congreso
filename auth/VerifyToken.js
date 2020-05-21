var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config/config.js'); // get our config file

function verifyToken(req, res, next) {

  //console.log("HEAADER REQ");
  //console.log(req);

  console.log("VERIFICANDO TOKEN");
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'] || req.cookies.EvoteToken;
  if (!token){ 
    //return res.status(403).send({ auth: false, message: 'No token provided.' });
    res.redirect("/admin");
  }
  // verifies secret and checks exp
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err)
        res.redirect("/admin"); 
      //return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id_supervisor;
    //req.username = decoded.username;
    //req.id_company = decoded.id_company;

    //console.log(req.id_company);
  
    next();
  });

}

module.exports = verifyToken;