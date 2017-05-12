/* LOAD ALL DEPENDENCIES
----------------------------------------- */
const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const request = require('request');

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

const dataObject = {
  actualAmount: 0,
  timeCount: 0,
  newDay: 1,
  dayNumber: 0,
  amountPerSecond: 20.25,  // 60x faster as normal
  kWhPerLiter: 3.4,
  gramPerLiter: 2640,
  dieselNotUsed: 0,
  co2NotUsed: 0,
}


const generateData = {
  doTest() {
    request('http://104.131.106.189/kwh', function (error, response, body) {
      console.log(body)
    })
  },
  getGoals() {
    request('https://p3-wottnow.herokuapp.com/', function (error, response, body) {
      const data = JSON.parse(body);
      dataObject.dayGoals = [data.target1, data.target2, data.target3, data.target4, data.target5];
      dataObject.totalGoal = data.total;
      dataObject.hoursPerDay = [10, 10, 10, 10, 10, 12, 12]
      dataObject.dayActual = [0, 0, 0, 0, 0, 0, 0];
      dataObject.dayGenerated = [0, 0, 0, 0, 0, 0 ,0];
      dataObject.totalGenerated = 0;
      generateData.startEnergyUse();
    });
  },
  startEnergyUse() {
    setInterval(function() {
    if(dataObject.dayNumber < 7) {
        dataObject.actualAmount = dataObject.actualAmount + dataObject.amountPerSecond + Math.floor(Math.random() * 4) + 1 ;
        dataObject.timeCount = dataObject.timeCount + 0.05;
        dataObject.dayActual[dataObject.dayNumber] = dataObject.dayActual[dataObject.dayNumber] + dataObject.amountPerSecond;
        if(dataObject.timeCount === dataObject.newDay) {
          dataObject.dayNumber ++;
          dataObject.timeCount = 0;
        }
        generateData.calculateValues()
      }
    }, 1000);
  },
  calculateValues() {
    // console.log(dataObject);
  }
}

generateData.doTest()
generateData.doTest()


generateData.getGoals()
setInterval(function() {
  // dataObject.totalGenerated = dataObject.totalGenerated + 40000;
  // dataObject.dayGenerated[dataObject.dayNumber] = dataObject.dayGenerated[dataObject.dayNumber] + 40000;
}, 1000);

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
