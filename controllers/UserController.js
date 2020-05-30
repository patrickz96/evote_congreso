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
    res.render('vote');
});

router.post('/vote',function(req,res){
    
    console.log(req.body);
    //res.redirect('/finish');
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