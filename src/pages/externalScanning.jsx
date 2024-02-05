import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./externalScanning.css";
import instructionsImage from "../images/Instructions.jpg";
import ExternalScanner from "./externalScanner"; // Import ExternalScanner instead of Scanner

const ExternalScanning = () => {
  const navigate = useNavigate();

  const handleSwitchLocation = () => {
    navigate("/");
  };

  const handleSwitchDevice = () => {
    navigate("/qr-scanning");
  };

  return (
    <div className="external">
      <div className="externalTitles">
        <h1>Welcome to SupportZebra!</h1>
        <h2>Scan your QR here to record your logs</h2>
        <ExternalScanner />
      </div>
      <div className="centerImage">
        <img
          className="instructionsImage"
          src={instructionsImage}
          alt="Instructions"
        ></img>
        <div className="buttons d-flex justify-content-center gap-1 switch-btn-container">
          <button
            type="button"
            className="btn btn-success external-back-btn"
            onClick={handleSwitchLocation}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-success external-switch-btn"
            id="switch-scanning-device"
            onClick={handleSwitchDevice}
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalScanning;
