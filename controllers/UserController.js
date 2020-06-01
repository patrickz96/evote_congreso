var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;

const VerifySession = require('../auth/VerifySession');

/****************LOGIN*******************/
router.get('/', function(req, res) {
    if(req.google_profile == undefined){
        res.render('index');
    }
    else{
        res.redirect('assistance');
    }
});
router.post('/login', function(req, res) {
    res.redirect('assistance');
});

/***************ASISTENCIA***************/

router.get('/assistance',VerifySession,async function(req,res){
    //Verify if google user is an elector and if he is in the electoral padron 
    var query = "select pe.id_padron_electoral from elector e inner join padron_electoral pe "+
    "on e.id_elector = pe.id_elector where email='"+req.google_profile.email+"'";

    var check_padron = await db.query(query);
    console.log("checking padron");
    if(check_padron[0].length==0){
        console.log("no se encontro en el padron");
        res.redirect("/logout");
    }
    else{
        //Verify if the user check the assitance before

            var query = "select id_asistencia from elector e inner join padron_electoral pe "+
            "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
            "where email='"+req.google_profile.email+"'";

            var check_assistance = await db.query(query);
            if(check_assistance[0].length==0){
                
                console.log("no marco asistencia");

                var id_padron_electoral = check_padron[0][0].id_padron_electoral;
                var status = req.session.status;
                var msg = req.session.msg;
                req.session = null;
                res.render('assistance',{status: status, message: msg,id_padron_electoral:id_padron_electoral,name: req.google_profile.name});    
            }
            else{
                var query = "select id_votacion from elector e inner join padron_electoral pe "+
                "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
                "inner join votacion v on v.id_asistencia = a.id_asistencia "+
                "where email='"+req.google_profile.email+"'";
                
                var check_votation = await db.query(query);

                if(check_votation[0].length==0){
                    console.log("marco asistencia");
                    res.redirect("/vote");
                }else{
                    console.log("marco voto");
                    //res.redirect("/finish-vote");
                    res.render('vote-finish',{name:req.google_profile.name});
                }
            }
    }
});


router.post('/assistance',VerifySession,function(req,res){
    //verify the secret_key
    //console.log(req.body);
    models.padron_electoral.findOne({
        where: {
          id_padron_electoral: req.body.id_padron_electoral,
          clave_secreta: req.body.secret_key
        }, returning: true,
        plain: true
      }).then(data =>{
          if(data==undefined){
            req.session.status = "error";req.session.msg = "LOS DATOS INGRESADOS SON INCORRECTOS";
            return res.redirect("/assistance");
          }else{

            //check assistance
            models.asistencia
            .create({
                id_padron_electoral:req.body.id_padron_electoral
            })
            .then(data => {
                //console.log(data);
                res.redirect('/vote');
            })
            .catch(err => {
                console.log(err);
                req.session.status = "error";req.session.msg = "OCURRIO UN ERROR AL MARCAR LA ASISTENCIA "+err;
                return res.redirect("/assistance");
            });

          } 
          
    
      }).catch(err=>{
        return res.status(500).send("There was a problem. "+err);
      });
});


/****************VOTE*****************/
router.get('/vote',VerifySession,async function(req,res){
    //console.log('redirecting vote');

    var query = "select id_asistencia from elector e inner join padron_electoral pe "+
    "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
    "where email='"+req.google_profile.email+"'";

    var check_assistance = await db.query(query);
    //console.log("length rpta",rpta[0].length);
    if(check_assistance[0].length==0){
        console.log("verificando que no marco asistencia");
        return res.redirect('/assistance'); 
    }else{
        console.log("verificando si realizo su votacion");

        var query = "select id_votacion from elector e inner join padron_electoral pe "+
        "on e.id_elector = pe.id_elector inner join asistencia a on pe.id_padron_electoral=a.id_padron_electoral "+
        "inner join votacion v on v.id_asistencia = a.id_asistencia "+
        "where email='"+req.google_profile.email+"'";
        
        var check_votation = await db.query(query);

        if(check_votation[0].length==0){
            console.log("marco asistencia");
            //res.redirect("/vote");
            //res.render('assistance',{name: req.google_profile.name});    
            res.render('vote',{id_asistencia: check_assistance[0][0].id_asistencia,name:req.google_profile.name});
    
        }else{
            console.log("marco voto");
            res.redirect("/finish");
        }
    }
});

router.post('/vote',VerifySession,async function(req,res){
    //console.log(req.body);
    var lista_asamblea = await db.query("select id_lista_electoral,nombre from lista_electoral where id_lista_electoral="+req.body.lista_asamblea);
    var lista_consejo = await db.query("select id_lista_electoral,nombre from lista_electoral where id_lista_electoral="+req.body.lista_consejo);
    req.session.status = "confirm-vote"; req.session.msg = {id_asistencia:req.body.id_asistencia,lista_asamblea:lista_asamblea[0][0],lista_consejo:lista_consejo[0][0]};
    res.redirect('/confirm-vote');
});

/***************CONFIRM-VOTE**********/
router.get('/confirm-vote',VerifySession,function(req,res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    if(status!='confirm-vote'){
        res.redirect('/vote');
    }else{
        res.render('vote-confirm',{status: status, data:msg });
        //res.render('vote-confirm',{status: status, lista_asamblea: msg.lista_asamblea,lista_consejo: msg.lista_consejo });
    }
});


router.post('/confirm-vote',VerifySession,async function (req, res) {
    console.log("confirming vote");
    console.log(req.body);
    //FINISH SAVE VOTE
    
    let transaction;    
    try {
      // get transaction
      transaction = await db.transaction();
      
      // save vote lista_asamblea
      await models.votacion.create({
        id_lista_electoral:req.body.id_lista_asamblea,
        id_asistencia:req.body.id_asistencia
      },{transaction});
      
      // save vote lista_consejo
      await models.votacion.create({
          id_lista_electoral:req.body.id_lista_consejo,
          id_asistencia:req.body.id_asistencia
      },{transaction});

      // commit
      await transaction.commit();
      res.redirect("/finish");
    
    } catch (err) {
      // Rollback transaction only if the transaction object is defined
      if (transaction) await transaction.rollback();
      res.status(500).send("Hubo un error intente ingresar de nuevo porfavor "+err);
    }        
});

/***************FINISH-VOTE**********/
router.get('/finish',VerifySession,function(req,res){
    res.redirect('/assistance');
    //res.render('vote-finish',{name:req.google_profile.name});
    //res.render('vote-finish',{name:'PATRICK LAZOO'});
});

/*
router.get('/finish-vote',VerifySession,function(req,res){
    //res.redirect('/assistance');
    res.render('vote-finish',{name:req.google_profile.name});
    //res.render('vote-finish',{name:'PATRICK LAZOO'});
});
*/

router.post('/get-electoral-list',VerifySession,function (req, res) {

    if(req.body.id_facultad==''){
        id_facultad=null
    }else{
        id_facultad=req.body.id_facultad;
    }
    
    models.lista_electoral.findAll({
    where:{id_tipo_proceso:req.body.id_tipo_proceso,id_facultad:id_facultad},
    order: [
        ['nombre', 'ASC']
    ]
    }).then(data => {
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


module.exports = router;