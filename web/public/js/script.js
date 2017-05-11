(function() {

  const socket = io();

  let actualAmount = 0;
  let generatedEnergy = 20; // Hard coded for now (later actual via Socket)
  let totalGoal = 1680;
  let dayGoal = 400;

  let dayPercentage = 0;
  let totalPercentage = 0;

  const generateData = {
    energyUse() {
      setInterval(function() {
        let totalAmountPerSecond = 3.75;
        actualAmount = actualAmount + totalAmountPerSecond;
        // console.log(`${actualAmount} kWh energy used`);
        generateData.calculatePercentage();
        // console.log(`${totalPercentage}% of total goal reached`);
        if(actualAmount >= 10000) {
          actualAmount = actualAmount;
        }
      }, 1000);
    },
    calculatePercentage() {
      totalPercentage = (actualAmount / totalGoal * 100).toFixed(2);
    }
  }

  generateData.energyUse()

}());
