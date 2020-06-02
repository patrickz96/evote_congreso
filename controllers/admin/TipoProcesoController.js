var express = require('express');
var router = express.Router();

const models = require(process.cwd()+"/models");
const db = require(process.cwd()+"/models").sequelize;
const VerifyToken = require(process.cwd()+'/auth/VerifyToken');


router.get('/process-type',VerifyToken,function(req, res) {
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session.status = undefined;
    req.session.msg = undefined;
    res.render('./admin/process-type',{status: status, message: msg });
});


//CREATE NEW PROCESS-TYPE
router.post('/process-type', function (req, res) {   
    models.tipo_proceso
    .create({
        id_proceso_electoral:req.body.electoral_process, 
        nombre:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.nombre+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/process-type');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/process-type');
    });
});


router.post('/process-type-update',VerifyToken, function (req, res) {
    console.log(req.body);
    
    
    models.tipo_proceso.update(
    { nombre:req.body.nombre,id_proceso_electoral:req.body.electoral_process}, 
    {where: { id_tipo_proceso: req.body.id },returning: true,plain:true},)  
    .then(obj => {
    req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+obj[1].nombre+" ACTUALIZADO CORRECTAMENTE";
    res.redirect('/admin/process-type');
    }).catch(err=>{
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/process-type');
    });
});

router.post('/process-type-delete', function (req, res) {

    models.tipo_proceso.destroy({
        where: {
            id_tipo_proceso: req.body.id
        }
      }).then(data=>{
        return res.status(200).send("ok");
      }).catch(err=>{
        return res.status(500).send("Hubo un problema al eleminar el tipo de proceso "+err);
      });
});


// RETURNS ALL PROCESS TYPE
router.get('/process-type/all', VerifyToken, function (req, res) {
    models.tipo_proceso.findAll({
        attributes: ['id_tipo_proceso','nombre'],
        include:[
        {model: models.proceso_electoral,attributes: ['id_proceso_electoral','nombre']},
    ]}).then(data => {
        //console.log(data);
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


module.exports = router;