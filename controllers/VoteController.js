var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;



router.get('/',function(req,res){
    res.render('vote', { title: 'Ingreso' });
});

router.get('/xd',function(req,res){

    models.electoral_census.findAll().then(data => {
        res.status(200).send(data);
        //res.render('trash', {"data":data});
    })
    .catch(err => {
        return res.status(500).send("There was a problem finding supervisor. "+err);
    });

    //res.send("hello test");
    //res.render('test');
});



module.exports = router;