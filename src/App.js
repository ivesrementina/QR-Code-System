import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QRScanning from "./pages/qrScanning";
import ExternalScanner from "./pages/externalScanner";
import Home from "./pages/Home"; // Import the Home component
import "./App.css";

function App() {
  const [resultFromScanner, setResultFromScanner] = useState(null);

  const handleScanResultChange = (result) => {
    // Handle the scanned result, e.g., store it in state
    setResultFromScanner(result);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Welcome to SZ, Choose your location</h1>
                  <Home />
                </div>
              }
            />
            <Route
              path="/qr-scanning"
              element={
                <QRScanning onScanResultChange={handleScanResultChange} />
              }
            />
            <Route
              path="/qr-scanning2"
              element={
                <ExternalScanning onScanResultChange={handleScanResultChange} />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
      {/* You can use resultFromScanner elsewhere in your app */}
      {resultFromScanner && (
        <div>
          Scanned Result: <a href={resultFromScanner}>{resultFromScanner}</a>
        </div>
      )}
    </div>
  );
}

export default App;
