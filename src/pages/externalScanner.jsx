import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./externalScanner.css";
import instructionsImage from "../images/Instructions.jpg" 

const ExternalScanner = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleSwitchLocation = () => {
    navigate("/");
  };

  const handleSwitchDevice = () => {
    // Navigate to the new page when the button is clicked
    navigate("/qr-scanning"); // Replace "/new-page" with the desired URL
  };

  return (
    <div className="qrScanning">
      <div className="Titles">
      <h5>Welcome to SupportZebra!</h5>
      <h5>Scan your QR here to record your logs</h5>
      </div>
      <div className="centerImage">
      <img className="instructionsImage" src={instructionsImage}></img>
      <div className="buttons" class="d-flex justify-content-center gap-1 switch-btn-container">
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
          onClick={handleSwitchDevice}
        >
          Switch
        </button>
      </div>
    </div>
    </div>
  );
};

export default ExternalScanner;