function verifySession(req, res, next) {

  if(req.session.google!=undefined){
    next();
  }else{
    res.redirect("/");
  } 
}

module.exports = verifySession;