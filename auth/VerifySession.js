function verifySession(req, res, next) {

  if(req.google_profile!=undefined){
    next();
  }else{
    res.redirect("/");
  } 
}

module.exports = verifySession;