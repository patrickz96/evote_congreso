var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;


/****************LOGIN*******************/
router.get('/', function(req, res) {
    res.render('index');
});
router.post('/login', function(req, res) {
    res.redirect('assistance');
});

/***************ASISTENCIA***************/
router.get('/assistance',function(req,res){
    res.render('assistance');
});
router.post('/assistance',function(req,res){
    res.redirect('/vote');
});

/****************VOTE*****************/
router.get('/vote',function(req,res){
    console.log('redirecting vote');
    res.render('vote');
});

router.post('/vote',async function(req,res){
    
    console.log(req.body);
    var lista_asamblea = await db.query("select id_lista_electoral,nombre from lista_electoral where id_lista_electoral="+req.body.lista_asamblea);
    var lista_consejo = await db.query("select id_lista_electoral,nombre from lista_electoral where id_lista_electoral="+req.body.lista_consejo);

    json_lista_asamblea = JSON.parse(JSON.stringify(lista_asamblea))[0][0];
    json_lista_consejo = JSON.parse(JSON.stringify(lista_consejo))[0][0];

    req.session.status = "ok"; req.session.msg = {lista_asamblea:json_lista_asamblea,lista_consejo:json_lista_consejo};
    res.redirect('/confirm-vote');
});

/***************CONFIRM-VOTE**********/
router.get('/confirm-vote',function(req,res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    if(status==undefined){
        res.redirect('/vote');
    }else{
        res.render('vote-confirm',{status: status, lista_asamblea: msg.lista_asamblea,lista_consejo: msg.lista_consejo });
    }
});


router.post('/confirm-vote', function (req, res) {
    console.log("confirming vote");
    console.log(req.body);
});

/***************FINISH-VOTE**********/
router.get('/finish',function(req,res){
    res.render('vote-finish');
});

router.post('/get-electoral-list', function (req, res) {

    //console.log("llego");
    //console.log(req.body);
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