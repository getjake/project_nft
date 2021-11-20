const { ethers } = require("hardhat");

async function main() {

  // Compile contract
  const SuperMarioWorld = await ethers.getContractFactory("SuperMarioWorld");
  const superMarioWorld = await SuperMarioWorld.deploy("SuperMarioWorld", "SPRM"); // inside params: name and symbol
  
  await superMarioWorld.deployed();
  console.log("Success! Contract was deployed to: ", superMarioWorld.address);

  // Mint NFT
  await superMarioWorld.mint("https://ipfs.io/ipfs/QmY8VNgpqnXT4kUaZMpGo3AQvwkeHpwymPs6QpvaQ8miXx")

  console.log("NFT successfully minted!");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
