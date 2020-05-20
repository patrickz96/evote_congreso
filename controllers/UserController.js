var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;


router.get('/', function(req, res) {
    res.render('index', { title: 'Ingreso' });
});

router.get('/index2', function(req, res) {
    res.render('index2', { title: 'Ingreso' });
});


router.post('/login', function(req, res) {
    //validate user and password
    //res.redirect('vote');
    res.redirect('assistance');
    //res.render('vote', { title: 'Ingreso' });
});



module.exports = router;