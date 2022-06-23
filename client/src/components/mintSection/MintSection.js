import React, { useEffect, useState } from "react";
import "./mintSection.css";
import Web3 from "web3";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Spinner from "react-bootstrap/Spinner";
import CookieClickerGameContract from "../../contracts/CookieClickerGameContract.json";
import CookieImage2 from "../../images/CookieImage2.png";
import Button from "react-bootstrap/Button";
import { ReactComponent as CookieImage } from "../../images/CookieImage2.png";

export default function MintSection() {
  const [score, setScore] = useState(0);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [showingResultMessage, setShowingResultMessage] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

  useEffect(async () => {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    const metamaskAccounts = await web3.eth.getAccounts();
    setAccounts(metamaskAccounts);

    try {
      const instance = new web3.eth.Contract(
        CookieClickerGameContract.abi,
        "0x47df32E4aAf6e64A820bf2Cd3dabDa0d049D482D"
      );

      setContract(instance);
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  const getCanvasBlob = (canvas) => {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      });
    });
  };

  const uploadImage = async () => {
    setLoading(true);

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var image = document.getElementById("img");
    ctx.drawImage(image, 5, 5, 100, 100);
    ctx.font = "10pt";
    ctx.strokeText(`Your score:${score}`, 100, 100);
    const canvasBlob = await getCanvasBlob(canvas);

    const addedFile = await client.add(canvasBlob);

    const imageUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`;

    const metaData = JSON.stringify({
      image: imageUrl,
      score: score,
    });

    const addedMetaData = await client.add(metaData);
    const url = `https://ipfs.infura.io/ipfs/${addedMetaData.path}`;

    initiateMint(url);
  };

  const initiateMint = async (tokenUri) => {
    contract.methods
      .mint(tokenUri)
      .send({ from: accounts[0] })
      .then((res) => {
        setResultMessage("Success, you minted an Nft!");
        setMetadataUrl(tokenUri);
        setShowingResultMessage(true);
        setLoading(false);
      })
      .catch((err) => {
        setResultMessage("There was an error:", err);
        setShowingResultMessage(true);
        setLoading(false);
      });
  };

  return (
    <div className="mint-section">
      <img
        id="img"
        className="cookie-image"
        src={CookieImage2}
        onClick={() => setScore(score + 1)}
      />
      <a href="https://pngtree.com/so/Cartoon">Cartoon png from pngtree.com/</a>

      <div className="score-text">Score: {score}</div>

      <button className="mint-section-button" onClick={uploadImage}>
        {loading ? <Spinner animation="border" /> : " Mint"}
      </button>
      {showingResultMessage && (
        <div className="resultMessage-container">
          <div className="resultMessage-text">{resultMessage}</div>
          <div
            className="metadataUrl-text"
            onClick={() => window.open(metadataUrl)}
          >
            Link to Data
          </div>
        </div>
      )}
    </div>
  );
}
