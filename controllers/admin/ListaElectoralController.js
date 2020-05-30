var express = require('express');
var router = express.Router();

const models = require(process.cwd()+"/models");
const db = require(process.cwd()+"/models").sequelize;
const VerifyToken = require(process.cwd()+'/auth/VerifyToken');



router.get('/electoral-list',VerifyToken,function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/electoral-list',{status: status, message: msg });
});


router.post('/electoral-list',VerifyToken,function (req, res) {
    console.log(req.body);    
    models.lista_electoral
    .create({
        id_facultad:req.body.faculty,
        id_tipo_proceso:req.body.process_type, 
        nombre:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.nombre+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/electoral-list');
    });
    
  });

  router.post('/electoral-list-update',VerifyToken, function (req, res) {
    console.log(req.body);
    
    models.lista_electoral.update(
        { nombre:req.body.name,id_tipo_proceso:req.body.type_process, id_facultad:req.body.faculty}, 
        {where: { id_lista_electoral: req.body.id },returning: true,plain:true},)  
      .then(obj => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+obj[1].nombre+" ACTUALIZADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
      }).catch(err=>{
          req.session.status = "error"; req.session.msg = ""+err;
          res.redirect('/admin/electoral-list');
      });
    
});




router.get('/electoral-list/all', VerifyToken, function (req, res) {
    models.lista_electoral.findAll({
    include:[
        {model: models.facultad,attributes: ['id_facultad','nombre']},
        {model: models.tipo_proceso,attributes: ['id_tipo_proceso','nombre']},
    ]
    }).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


router.post('/electoral-list-delete', function (req, res) {

    models.lista_electoral.destroy({
        where: {
            id_lista_electoral: req.body.id
        }
      }).then(data=>{
        return res.status(200).send("ok");
      }).catch(err=>{
        return res.status(500).send("Hubo un problema al eliminar la lista electoral "+err);
      });
});



router.get('/faculty/all', VerifyToken, function (req, res) {
    models.facultad.findAll().then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


module.exports = router;