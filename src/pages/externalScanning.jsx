import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./externalScanning.css";
import instructionsImage from "../images/Instructions.jpg";
import ExternalScanner from "./externalScanner";

const ExternalScanning = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleSwitchLocation = () => {
    navigate("/");
  };

  const handleSwitchDevice = () => {
    // Navigate to the new page when the button is clicked
    navigate("/qr-scanning"); // Replace "/new-page" with the desired URL
  };

  return (
    <div className="external">
      <div className="externalTitles">
        <h1>Welcome to SupportZebra!</h1>
        <h2>Scan your QR here to record your logs</h2>
        <ExternalScanner />
      </div>
      <div className="centerImage">
        <img className="instructionsImage" src={instructionsImage}></img>
        <div
          className="buttons"
          class="d-flex justify-content-center gap-1 switch-btn-container"
        >
          <button
            type="externalButton"
            className="btn btn-success external-back-btn"
            onClick={handleSwitchLocation}
          >
            Back
          </button>
          <button
            type="externalButton"
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
