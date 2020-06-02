var express = require('express');
var router = express.Router();

const models = require("../models");
const db = require("../models").sequelize;
const VerifyToken = require('../auth/VerifyToken');


router.get('/panel',VerifyToken,function(req, res) {
    //console.log("enter");
    res.render('./admin/admin');
});

router.get('/register', function(req, res) {
    res.render('./admin/register');
});

module.exports = router;