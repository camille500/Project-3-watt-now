/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();

/* INDEX ROUTE
----------------------------------------- */
router.get('/', function(req, res) {
    const collection = db.collection('targets');
    const ObjectID = require('mongodb').ObjectID;
    collection.findOne({ "_id": ObjectID(process.env.TARGETID) }, function(err, targets) {
        res.send(targets);
    });
});

router.get('/kwh', function(req, res) {
    const collection = db.collection('targets');
    const ObjectID = require('mongodb').ObjectID;
    collection.findOne({ "_id": ObjectID(process.env.KWHID) }, function(err, targets) {
        res.send(targets);
    });
});

router.get('/test', function(req, res) {
    res.render('index')
});

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
