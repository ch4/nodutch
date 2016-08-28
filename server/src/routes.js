'use strict';

var express = require('express');
var router = express.Router();

var thing = require('./thing/thing.controller');
var simplify = require('./simplify/simplify.controller');

// things ressources
router.get('/api/things', thing.find);
router.get('/api/things/:id', thing.get);
router.post('/api/things', thing.post);
router.put('/api/things/:id', thing.put);


router.get('/api/simplify/createCard', simplify.createCard);

module.exports = router;
