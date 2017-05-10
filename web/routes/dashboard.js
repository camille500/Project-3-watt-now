/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');

/* INDEX ROUTE
----------------------------------------- */
router.get('/', function(req, res) {
  res.render('dashboard/index')
});

router.get('/settings', checkForSession, function(req,res) {
  res.render('dashboard/settings')
});

router.post('/settings', checkForSession, function(req,res) {
  const collection = db.collection('targets');
  const target1 = req.body.target1;
  const target2 = req.body.target2;
  const target3 = req.body.target3;
  const target4 = req.body.target4;
  const target5 = req.body.target5;
  const total = Number(target1) + Number(target2) + Number(target3) + Number(target4) + Number(target5);
  const data = {
    type: 'main',
    target1: target1,
    target2: target2,
    target3: target3,
    target4: target4,
    target5: target5,
    total: total
  }
  collection.findOneAndUpdate({type: data.type}, data, {upsert:true}, function(err, doc) {
   if (err) return res.send(500, {error: err});
   res.redirect('/dashboard/')
 });
});

function checkForSession(req, res, next) {
  if (req.session.login) {
     next();
   } else {
     res.redirect('/account');
   }
}

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
