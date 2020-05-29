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
    res.redirect('/finish');
});
/***************FINISH-VOTE**********/
router.get('/finish',function(req,res){
    res.render('vote-finish');
});

module.exports = router;