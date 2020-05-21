var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;
const VerifyToken = require('../auth/VerifyToken');

/*
router.get('/', function(req, res) {
    res.render('./admin/index', { title: 'Evote-ADMIN' });
});
*/

router.get('/panel',VerifyToken,function(req, res) {
    console.log("enter");
    res.render('./admin/admin', { title: 'Evote-ADMIN' });
});

router.get('/register', function(req, res) {
    res.render('./admin/register', { title: 'Evote-ADMIN' });
});


router.get('/electoral-process',VerifyToken,function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/electoral-process',{status: status, message: msg });
  });

//CREATE NEW DRIVER
router.post('/electoral-process', function (req, res) {
    console.log("saving new driver");
    console.log(req.body);    
    models.electoral_process
    .create({
        date_init:req.body.date_init, 
        date_end:req.body.date_end,
        name:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.name+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-process');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/electoral-process');
    });
  });


// RETURNS ALL DRIVERS
router.get('/electoral-process/all', VerifyToken, function (req, res) {
    models.electoral_process.findAll().then(data => {
        console.log(data);
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});


router.get('/process-type',VerifyToken,function(req, res) {
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/process-type',{status: status, message: msg });
});


//CREATE NEW DRIVER
router.post('/process-type', function (req, res) {
    //console.log("saving new driver");
    //console.log(req.body);    
    models.process_type
    .create({
        id_electoral_process:req.body.electoral_process, 
        name:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.name+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/process-type');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/process-type');
    });
    
  });

// RETURNS ALL DRIVERS
router.get('/process-type/all', VerifyToken, function (req, res) {
    models.process_type.findAll({
        attributes: ['id_process_type','name'],
        include:[
        {model: models.electoral_process,attributes: ['name']},
    ]}).then(data => {
        //console.log(data);
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});



router.get('/electoral-list',VerifyToken,function(req, res){
    var status = req.session.status;
    var msg = req.session.msg ;
    req.session = null;
    res.render('./admin/electoral-list',{status: status, message: msg });
});


//CREATE NEW DRIVER
router.post('/electoral-list', function (req, res) {
    //console.log("saving new driver");
    console.log(req.body);    
    
    models.electoral_list
    .create({
        id_faculty:req.body.faculty,
        id_process_type:req.body.process_type, 
        name:req.body.name
    })
    .then(data => {
        req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.name+" REGISTRADO CORRECTAMENTE";
        res.redirect('/admin/electoral-list');
    })
    .catch(err => {
        req.session.status = "error"; req.session.msg = ""+err;
        res.redirect('/admin/electoral-list');
    });
    
  });

router.get('/electoral-list/all', VerifyToken, function (req, res) {
    models.electoral_list.findAll({
    include:[
        {model: models.faculty,attributes: ['name']},
        {model: models.process_type,attributes: ['name']},
    ]
    }).then(data => {
        //console.log(data);
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});

router.get('/faculty/all', VerifyToken, function (req, res) {
    models.faculty.findAll().then(data => {
        //console.log(data);
        res.status(200).send(data);
    })    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});



router.get('/historical',VerifyToken,function(req,res){
    res.render('./admin/historical');
});

/*
router.post('/login', function(req, res) {
    res.redirect("/admin/panel");
});
*/


module.exports = router;