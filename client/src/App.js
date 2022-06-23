import React from "react";
import "./App.css";
import AppContainer from "./components/appContainer/AppContainer";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div style={{ backgroundColor: "#0c6efd", height: "100%", width: "100%" }}>
      <AppContainer />
    </div>
  );
}
