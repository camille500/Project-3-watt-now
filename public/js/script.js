(function() {

  const socket = io();

  let actualAmount = 0;

  const generateData = {
    energyUse() {
      setInterval(function() {
        let totalAmountPerSecond = 0.375;
        actualAmount = actualAmount + totalAmountPerSecond;
        console.log(actualAmount);
        if(actualAmount >= 10000) {
          actualAmount = actualAmount;
        }
      }, 1000);
    }
  }

  generateData.energyUse()

}());
