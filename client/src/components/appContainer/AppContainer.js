import React, { useState } from "react";
import MetamaskButton from "../MetamaskButton";
import MintSection from "../mintSection/MintSection";
import Title from "../title/Title";
import "./appContainer.css";

export default function AppContainer() {
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  return (
    <div className="appContainer">
      <Title />
      {metamaskConnected ? (
        <MintSection />
      ) : (
        <div className="metamaskButton-container">
          <MetamaskButton connect={(value) => setMetamaskConnected(value)} />
        </div>
      )}
    </div>
  );
}
