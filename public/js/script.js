(function() {

  const socket = io();

  let actualAmount = 0;

  const generateData = {
    energyUse() {
      setInterval(function() {
        let totalAmountPerSecond = Math.floor((Math.random() * 10) + 1);
        actualAmount = actualAmount + totalAmountPerSecond;
        console.log(actualAmount);
      }, 1000);
    }
  }

  generateData.energyUse()

}());
