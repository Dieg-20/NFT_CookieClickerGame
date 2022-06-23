import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Button from "react-bootstrap/Button";

export default function MetamaskButton({ connect }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  useEffect(async () => {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    const metamaskAccounts = await web3.eth.getAccounts();

    if (metamaskAccounts.length > 0) {
      setMetamaskConnected(true);
      connect(true);
    }
  }, []);

  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      setMetamaskConnected(false);
      connect(false);
    }
  });

  const initiateMetamaskConnection = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          setMetamaskConnected(true);
          connect(true);
        })
        .catch((err) => {
          setErrorMessage("Unable to connect with Metamask:", err);
        });
    }
  };

  return (
    <button
      className="mint-section-button"
      onClick={initiateMetamaskConnection}
    >
      {metamaskConnected ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
}
