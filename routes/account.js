/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');

/* INDEX ROUTE
----------------------------------------- */
router.get('/', function(req, res) {
  if (req.session.login) {
    res.redirect('/dashboard')
  } else {
    res.redirect('/account/login');
  }
});

router.get('/login', function(req, res) {
  res.locals.message = '';
  res.render('account/login');
});

router.post('/login', function(req, res) {
  const collection = db.collection('users');
  const loginName = req.body.username;
  const loginPassword = req.body.password;
  collection.findOne({
    username: loginName
  }, function(err, user) {
    if (user) {
      const pwCheck = passwordHash.verify(loginPassword, user['password']);
      if (pwCheck === true) {
        collection.updateOne(user, {$set: {login: true}}, (error, result) => {
          if (err) return console.log(err)
        })
        req.session.login = true;
        req.session.data = user;
        res.redirect('/dashboard/');
      }
    } else {
      res.locals.message = 'De inloggegevens zijn onjuist';
      res.render('account/login')
    }
  });
});

router.get('/register', function(req, res) {
  res.locals.message = "";
  res.render('account/register');
});

router.post('/register', function(req, res) {
  const collection = db.collection('users');
  const regName = req.body.username;
  const regMail = req.body.mail;
  const regHometown = req.body.hometown;
  const regPassword = passwordHash.generate(req.body.password);
  const regData = {
    username: regName,
    mail: regMail,
    homeTown: regHometown,
    password: regPassword
  };
  collection.findOne({
    username: regName
  }, function(err, user) {
    if (user) {
      res.locals.message = "De gekozen gebruikersnaam bestaat al";
      res.render('account/register');
    } else {
      collection.save(regData, (err, result) => {
        if (err) return console.log(err);
        res.redirect('/account/login');
      });
    }
  });
});

router.get('/logout', function(req, res) {
  const collection = db.collection('users');
  collection.findOne({
    username: req.session.data.username
  }, function(err, user) {
    collection.updateOne(user, {$set: {login: false}}, (error, result) => {
      if (err) return console.log(err)
    })
  })
  req.session.destroy(function() {
    res.redirect('/');
  });
});

/* EXPORT ROUTER
----------------------------------------- */
module.exports = router;
