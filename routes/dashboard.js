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
  const collection = db.collection('users');
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
