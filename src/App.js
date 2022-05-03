import './App.css';
import { useEffect, useState } from 'react';
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nftvideo.mp4";
import { useMoralis } from "react-moralis";
import abi from "./contracts/contract.json";
import ReactLoading from 'react-loading';

let CONTRACT_ADDRESS = "0x3b78451f3fea5868cde37f82a74a66aaa5e9ef08"

function App() {
  const { Moralis, authenticate, isAuthenticated, user, logout, enableWeb3 } = useMoralis();

  //Save data to pass in JSX
  const [inProgress, setInProgress] = useState(false);
  const [hash, setHash] = useState("");
  const [isComplete, setIsComplete] = useState(false)

  const mint = async () => {

    const readOptions = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "mint",
      abi: abi,
      params: {
        id: 0,
        amount: 1
      },
      msgValue: 1000000000000000
    };

    
    const transaction = await Moralis.executeFunction(readOptions);
    setInProgress(true);
    setHash(transaction.hash);

    //wating for transaction to finish --> waiting for 3 nodes to confirm
    await transaction.wait(3).then((receipt) => {
      setInProgress(false);
      setIsComplete(true);
    })
  }

  //Need this function to enable web3 
  //Use effect runs something every time a web page is loaded
  useEffect(()=> {
    const start = async () => {
      await enableWeb3();
    }
    start();
  }, [])

  const checkEtherscan = () => {
    const url = "https://rinkeby.etherscan.io/tx/" + hash;
    window.open(url, "blank");
  }

  const viewOpenSea = () => {
    const url = "https://testnets.opensea.io/assets/0x3b78451f3fea5868cde37f82a74a66aaa5e9ef08/0";
    window.open(url, "blank");
  }




  return (
    <div className="App">
      <video className='background-video' src={backgroundVideo} autoPlay={true} loop={true} muted={true}/>
      <div className="main">
        <div className="content">
          <div className="nft-container">
            <video className="nft-video" src={nftVideo} autoPlay={true} loop={true} muted={true}/>
          </div>
          <div className="description">
            <h2>Adidos: INTO THE METAVERSE</h2>
            {
              isComplete
              ?<div className='info-text'>Congratulations your NFT is minted!!</div>
              :<div className='info-text'>12 minted / 300</div>
            }
            <div className="actions">
              {
                isAuthenticated
                  ? <>
                      {
                        inProgress
                          ? <>
                              <ReactLoading type="bubbles" color="#fff" height={64} />
                              <button className="filled-button" onClick={() => checkEtherscan()}>Check Etherscan</button>
                            </>
                          : isComplete
                            ? <button className="filled-button" onClick={() => viewOpenSea()}>View OpenSea</button>
                            : <button className="filled-button" onClick={() => mint()}>Mint</button>
                      }
                      <button className="transparent-button" onClick={() => logout()}>Start Over</button>
                    </>
                  : <>
                      <button className="filled-button" onClick={() => authenticate()}>Connect Wallet</button>
                      <button className="transparent-button">Learn More</button>
                    </>
              }
            </div>
          </div>
        </div>
        <div className="footer">
          MINTING NOW
        </div>
      </div>
    </div>
  );
}

export default App;
