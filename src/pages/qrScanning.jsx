import React, { useState } from "react";

import Scanner from "./Scanner";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./qrScanning.css";

const QRScanning = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleSwitchLocation = () => {
    navigate("/");
  };
  const [showTitle, setShowTitle] = useState(true);

  const handleSwitchDevice = () => {
    // Navigate to the new page when the button is clicked
    navigate("/qr-scanning2"); // Replace "/new-page" with the desired URL
  };

  return (
    <div className="qrScanning">
      <div className="d-flex justify-content-center gap-1 switch-btn-container">
        <button
          type="button"
          className="btn btn-success back-btn"
          onClick={handleSwitchLocation}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-success switch-btn"
          id="switch-scanning-device"
          onClick={handleSwitchDevice} // Call the new function on button click
        >
          Switch
        </button>
      </div>
<<<<<<< HEAD
      <div className="qrScanning-camera">
        <div className="qrScanningHeader">
          <h1>Welcome to SupportZebra!</h1>
          <h2>Scan your QR here to record your logs</h2>
        </div>
        <Scanner />
=======
      <div className="Titles">
        {showTitle && (
          <>
            <h1>Welcome to SupportZebra!</h1>
            <h2>Scan your QR here to record your logs</h2>
          </>
        )}
        <Scanner action={setShowTitle} />
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38
      </div>
    </div>
  );
};

export default QRScanning;
