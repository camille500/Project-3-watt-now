/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');

/* INDEX ROUTE
----------------------------------------- */
router.get('/', checkForSession, function(req, res) {
  res.render('dashboard/index')
});

function checkForSession() {
  if (req.session.login) {
     next();
   } else {
     res.redirect('/account');
   }
}

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
