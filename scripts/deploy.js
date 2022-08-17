const main = async () => {
    const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
    const coffeeDeployed = await BuyMeCoffee.deploy();
    console.log("Address:", coffeeDeployed.address);
  };
  
  main()
    .then(()=>process.exit(0))
    .catch((error) => {
      console.log("error");
      process.exit(1);
    });