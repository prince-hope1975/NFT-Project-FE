import React, {useEffect, useState} from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers"
import myEpicNft from './utils/MyEpicNFT.json';
import "./tailwind.css"


// Constants
const TWITTER_HANDLE = 'Prince_RedEyes';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

  // const CONTRACT_ADDRESS="0x0314Ec6b8098483A68c911c7aD3D5AdDa0955D9c" ;
    const CONTRACT_ADDRESS="0x622816de817e7eAbEb3c4467B532c17546399d5e" ;
const App = () => {
  // Render Methods
  const [currentAccount, setCurrentAccount] = useState("")
  const [currentCount, setCurrentCount] = useState(0);
  const [contract, setContract] = useState(null)
  const [mining, setMining] = useState(false)



  const checkIfWalletIsConnected = async () =>{
  const {ethereum} = window;

 
  if(!ethereum){
    console.log(`Make Sure you have metamask !`)
    return
  }
  else{
    console.log(`We have the ethereum object ${ethereum}`)
  }

  const accounts = await ethereum.request({method:"eth_accounts"})

  if (accounts.length !==0){
    const account = accounts[0]
    console.log("Found an authorized account:", account)
    setCurrentAccount(account)
    setEventListener()
  }
  else{
    console.log("No authoried accounts found")
  }

} 

const connectWallet = async () =>{
  try{
    const {ethereum} = window;

    if(!ethereum){
      alert("Get MetaMask!")
      return
    }
    const accounts = await ethereum.request({method: "eth_requestAccounts"})

    console.log("Connected", accounts[0])
    setCurrentAccount(accounts[0])

    setEventListener()
  }
  catch(error){
    console.log(error)
  }
}
const setEventListener = async ()=>{
  try{
    const {ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()

      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
    connectedContract.on("NewEpicNFtMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")
    }
  }
  catch(error){
    console.log(error)
  }
}
const askContractToMintNft = async ()=>{
 try{ const {ethereum} =window;
  if(ethereum){
    const provider  = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

    console.log("Going to pop wallet now to pay Gas fee ...")
    let nftTxn = await connectedContract.makeAnEpicNFT();

    console.log("'mining ... Please wait.'")

    await nftTxn.wait();

    console.log(`Mined, see traansaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
    
  }
  else {
    console.log("Ethereum object doesn't exist")
  }}
  catch(error){
    console.log(error)
  }
}

const handleNFTMint = async()=>{
try{ 
  setMining(true)
  await askContractToMintNft()
const {_hex} = await contract.getTotalNFTsMintedSoFar()
  setCurrentCount(parseInt(_hex,16))
   setMining(false)
  }
catch(e){
  console.log(e)
}
}
 const renderNotConnectedContainer = () => (
    <button 
    onClick={connectWallet}
    className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  useEffect(()=>{
    ( async () =>{  try{
      checkIfWalletIsConnected()
      const {ethereum} = window
      
      const chainId = await ethereum.request({method:"eth_chainId"})
    console.log("Connected to Chain",chainId)
      const rinckebyChainId = "0x4"
      if(chainId !== rinckebyChainId){
      alert("You're on the wrong network Please connect to The Rinkeby Test Network!")
    }

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()

      const connectedContract = await new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
      setContract(connectedContract)
      console.log(connectedContract)
      // setCurrentCount(connectedContract.getTotalNFTsMintedSoFar())
      const {_hex}= await connectedContract.getTotalNFTsMintedSoFar()

      setCurrentCount(parseInt(_hex,16))
      console.log("current count:",currentCount)
    }
    }
    catch(e){
      console.log(e)
    }}
)()  },[])

  return (
    <div className="App relative">
   {mining &&   <div className="w-screen h-screen absolute flex flex-col bg-opacity-20 bg-red-200 items-center  gap-8 justify-center">
      <div className="w-20 h-20 bg-gray-100 animate-spin"></div>
      <p className="text-center font-sans text-lg pl-2 text-red-200 font-white">Mining, Please wait...</p>
      </div>}
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Prince's NFT Collection</p>
          <p className="sub-text">{currentCount} / 50 NFT's Minted</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ?renderNotConnectedContainer(): <button className="bg-green-300 w-20 h-auto p-2 rounded-sm mt-6 hover:text-white hover:bg-green-500" onClick ={handleNFTMint}>
          Mint NFT
          </button>}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;