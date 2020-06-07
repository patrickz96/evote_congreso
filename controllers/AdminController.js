var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;
const VerifyToken = require('../auth/VerifyToken');


router.get('/panel',VerifyToken,function(req, res) {
    //console.log("enter");
    res.render('./admin/admin');
});

/*
router.get('/register', function(req, res) {
    res.render('./admin/register');
});
*/

/******* CLEAN ASISTENCE AND VOTATION *******/

router.get('/asistencia/all', VerifyToken, function (req, res) {
    models.asistencia.findAll({}).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("Hubo un problema cargando la lista padron." + err);
    });
});

router.get('/votacion/all', VerifyToken, function (req, res) {
    models.votacion.findAll({}).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("Hubo un problema cargando la lista padron." + err);
    });
});


router.post('/votacion-clean',VerifyToken, function (req, res) {
    //console.log(req.body.password);
    if(req.body.password=="destroymeouis"){
            models.votacion.destroy({where:{}}).then(data=>{
                return res.status(200).send("ok");
            }).catch(err=>{
                console.log("error "+err);
                return res.status(500).send("Hubo un problema al limpiar la tabla de votacion "+err);
            });
    }else{
        console.log("returning error");
        return res.status(500).send("Password incorrecto");
    }
});

router.post('/asistencia-clean',VerifyToken, function (req, res) {
    //console.log(req.body.password);
    if(req.body.password=="destroymeouis"){
            models.asistencia.destroy({where:{}}).then(data=>{
                return res.status(200).send("ok");
            }).catch(err=>{
                console.log("error "+err);
                return res.status(500).send("Hubo un problema al limpiar la tabla de votacion "+err);
            });
    }else{
        console.log("returning error");
        return res.status(500).send("Password incorrecto");
    }

});

// Muestra el padron del proceso activo, accion generar claves y la accion para enviar las claves.
router.get('/padron-activo', VerifyToken, function(req, res){
    res.render('./admin/padron-activo');
});

router.get('/padron-electoral/all', VerifyToken, function (req, res) {
    models.padron_electoral.findAll({
        include:[
            {model: models.elector, attributes: ['id_elector','apn','email']},
        ]
    }).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});

router.post('/send',VerifyToken, (req, res)=> {
    var exec = require('child_process').exec;
    exec('php -f ./scripts/send_keys.php', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      });
    return res.status(200).send("Se ha enviado los correos");
});

router.post('/generate_keys',VerifyToken, (req, res)=> {
    const shell = require('shelljs')
    shell.exec('/var/www/html/elecciones-virtuales/scripts/set_secret_keys.sh');
    return res.status(200).send("Se han generado las claves");
});

router.post('/clean_keys',VerifyToken, (req, res)=> {
    models.padron_electoral.update(
        { enviado:false, clave_secreta: null},
        {where: {}, plain:true})
      .then(data => {
        req.session.status = "ok"; req.session.msg =  "PADRON ELECTORAL ACTUALIZADO CORRECTAMENTE";
        res.status(200).send(data);
      }).catch(err=>{
          req.session.status = "error";
          req.session.msg = ""+err;
          res.redirect('/admin/padron-activo');
      });
});

router.post('/retry_send',VerifyToken, (req, res)=> {
    var exec = require('child_process').exec;
    exec('php -f ./scripts/retry_send.php', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      });
    return res.status(200).send("Se ha enviado los correos que faltaban");
});

module.exports = router;