var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;


router.get('/', function(req, res) {
    res.render('admin_index', { title: 'Express' });
});


module.exports = router;