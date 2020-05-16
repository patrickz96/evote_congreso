var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;


router.get('/', function(req, res) {
    res.render('index', { title: 'Ingreso' });
});


router.post('/login', function(req, res) {

    //validate user and password
    res.render('vote', { title: 'Ingreso' });
});


module.exports = router;