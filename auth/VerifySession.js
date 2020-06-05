function verifySession(req, res, next) {

  if(req.session.google!=undefined){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    //next();
    next();
  }else{
    res.redirect("/");
  } 
}

module.exports = verifySession;