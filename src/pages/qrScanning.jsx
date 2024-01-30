import React from "react";
import Scanner from "./Scanner";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./qrScanning.css";

const QRScanning = () => {
  const handleSwitchLocation = () => {
    // Add your location switching logic here
    console.log("Switching location...");
  };

  return (
    <div className="qrScanning">
      <h5>Welcome to SupportZebra!</h5>
      <h5>Scan your QR here to record your logs</h5>
      <Scanner />
      <div className="d-flex justify-content-center gap-5 switch-btn-container">
        <button
          type="button"
          className="btn btn-success switch-btn"
          onClick={handleSwitchLocation}
        >
          Switch Location
        </button>
        <button
          type="button"
          className="btn btn-success switch-btn"
          id="switch-scanning-device"
        >
          Switch Scanning Device
        </button>
      </div>
    </div>
  );
};

export default QRScanning;
