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


module.exports = router;