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

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
