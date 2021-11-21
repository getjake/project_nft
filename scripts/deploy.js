const { ethers } = require("hardhat");

async function main() {

  // Compile contract
  const SuperMarioWorld = await ethers.getContractFactory("SuperMarioWorldERC1155");
  const superMarioWorld = await SuperMarioWorld.deploy("SuperMarioWorldERC1155", "SPRMOE"); // inside params: name and symbol
  
  await superMarioWorld.deployed();
  console.log("Success! Contract was deployed to: ", superMarioWorld.address);

  // Mint NFT
  await superMarioWorld.mint(10, "https://ipfs.io/ipfs/QmdqejYAmzX1iMUaUyyeT4nXBkXCmB8si1sAohtx64jMsC")

  console.log("NFT successfully minted!");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
