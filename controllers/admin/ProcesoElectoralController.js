var express = require('express');
var router = express.Router();

const models = require(process.cwd()+"/models");

//const models = require(__dirname +"/.../models");

const db = require(process.cwd()+"/models").sequelize;
const VerifyToken = require(process.cwd()+'/auth/VerifyToken');


router.get('/electoral-process',VerifyToken,function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/electoral-process',{status: status, message: msg });
});


router.post('/electoral-process',VerifyToken, function (req, res) {
    models.proceso_electoral
    .create({
        apertura:req.body.date_init, 
        cierre:req.body.date_end,
        nombre:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.nombre+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-process');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/electoral-process');
    });
});

router.post('/electoral-process-update',VerifyToken, function (req, res) {
    
    models.proceso_electoral.update(
        { nombre:req.body.name,apertura:req.body.init_date,cierre:req.body.end_date }, 
        {where: { id_proceso_electoral: req.body.id },returning: true,plain:true},)  
      .then(obj => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+obj[1].nombre+" ACTUALIZADO CORRECTAMENTE";
        res.redirect('/admin/electoral-process');
      }).catch(err=>{
          req.session.status = "error"; req.session.msg = ""+err;
          res.redirect('/admin/electoral-process');
      });
});

router.post('/electoral-process-delete', function (req, res) {

    models.proceso_electoral.destroy({
        where: {
            id_proceso_electoral: req.body.id
        }
      }).then(data=>{
        return res.status(200).send("ok");
      }).catch(err=>{
        return res.status(500).send("Hubo un problema al eleminar el proceso electoral"+err);
      });
});

router.get('/electoral-process/all', VerifyToken, function (req, res) {
    models.proceso_electoral.findAll().then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        console.log("ERROR: "+err);
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});



module.exports = router;