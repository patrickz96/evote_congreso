var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;



router.get('/',function(req,res){
    res.render('vote', { title: 'Ingreso' });
});

router.post('/',function(req,res){
    console.log("saving...");
    res.redirect('/vote/finish');
});

router.get('/finish',function(req,res){
    res.render('vote-finish', { title: 'Ingreso' });
});



router.get('/xd',function(req,res){

    models.electoral_census.findAll().then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });
});



module.exports = router;