import React from "react";
import styled from "styled-components";
import { NFTCard, NftPhoto } from "./components/NFTCard";
import { NFTModal } from "./components/NFTModal";
import { useState } from 'react';
import { ethers } from 'ethers';

const axios = require('axios');

function App() {

  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState();
  const [nfts, setNfts] = useState(initialNfts);
  // let nft = { name: "Mario", symbol: "SMWC", copies: 10, image: "https://nftimage.com/XXX/" };


  let initialNfts = [
    {
      name: "Mario",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
    {
      name: "Luigi",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
    {
      name: "Yoshi",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
    {
      name: "Donkey Kong",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
    {
      name: "Yoshi",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
    {
      name: "Donkey Kong",
      symbol: "SMWC",
      copies: 10,
      image: "https://nftimage.com/XXX/",
    },
  ];

  const toggleModal = (i) => {
    if(i >= 0) {
      setSelectedNft(nfts[i])
    }
    setShowModal(!showModal);
  };

  const getMetadataFromIpfs = async (tokenURI) => {
    let metadata = await axios.get(tokenURI);
    return metadata.data;
  };

  const getNfts = async (address) => {
    const rpc = "https://rpc-mumbai.maticvigil.com/";
    const ethersProvider = new ethers.providers.JsonRpcProvider(rpc);
    
    let abi = [
      "function symbol() public view returns(string memory)",
      "function tokenCount() public view returns(uiint256)",
      "function uri(uint256 _tokenId) public view returns(string memory)",
      "function balanceOfBatch(address[], accounts, uint256[] ids) public view returns(uint256 array)"
    ];

    let nftCollection = new ethers.Contract(
      "0x052D6dbF358a21E008E60b08DeBd674f93B7654c",
      abi,
      ethersProvider
    );

    let numberOfNfts = (await nftCollection.tokenCount()).toNumber();
    let collectionSymbol = (await nftCollection.symbol());
    let accounts = Array(numberOfNfts).fill(address);

    let ids = Array.from({length: numberOfNfts}, (_, i) => i + 1);
    let copies = await nftCollection.balanceOfBatch(accounts, ids);

    // Get data from IPFS
    let tempArray = [];
    let baseUrl = "";

    for (let i = 1; i <= numberOfNfts; i++) {
      if (i == 1) { // ipfs.com/cid/1.json
        let tokenURI = await nftCollection.uri(i);
        baseUrl = tokenURI.replace(/\d+.json/, "");
        let metadata = await getMetadataFromIpfs(tokenURI);
        metadata.symbol = collectionSymbol;
        metadata.copies = copies[i - 1];
        tempArray.push(metadata);
      } else {
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}.json`);
        metadata.symbol = collectionSymbol;
        metadata.copies = copies[i - 1];
        tempArray.push(metadata);
      }
     };
    
     setNfts(tempArray);

  };


  return (
    <div className="App">
      <Container>
        <Title> SuperMarioWorldCollection</Title>
        <Subtitle> The rarest and best supermario world.</Subtitle>
        <Grid>
          {nfts.map((nft, i) => (
            <NFTCard nft={nft} key={i} toggleModal={ () => toggleModal(i) }/>
          ))}
        </Grid>
      </Container>
      {
        showModal && <NFTModal nft={selectedNft} toggleModal={ () => toggleModal() }/>
      }
    </div>
  );
}

const Title = styled.h1`
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.h4`
  color: grey;
  margin-top: 0;
  text-align: center;
`;

const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 100px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;
`;

export default App;
