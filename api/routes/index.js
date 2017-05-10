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

router.post('/', function(req, res) {


    console.log(res);
});




/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
