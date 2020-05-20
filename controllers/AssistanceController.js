var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;



router.get('/',function(req,res){

    res.render('assistance', { title: 'Ingreso' });
});


router.post('/',function(req,res){
    res.redirect('../vote');
});


module.exports = router;