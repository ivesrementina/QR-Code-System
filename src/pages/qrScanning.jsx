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
      <div class="d-flex justify-content-center gap-5 switch-btn-container">
        <button type="button" class="btn btn-success switch-btn">
          Switch Location
        </button>
        <button
          type="button"
          class="btn btn-success switch-btn"
          id="switch-scanning-device"
        >
          Switch Scanning Device
        </button>
      </div>
    </div>
  );
};

export default QRScanning;
