import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Buttons() {
  const [selectedOption, setSelectedOption] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data using GET method when the component mounts
    fetch(`http://localhost:4440/logsz/scannerLocations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const scannerData = data.scannerLocations[0];
        console.log(scannerData);
        setSelectedOption(scannerData.scannerLocation_ID);
        setLocations(data.scannerLocations);
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error
        setIsLoading(false);
      });
  }, []);

  const handleOptionChange = (event) => {
    setButtonDisabled(true); // Disable the button when a new location is selected
    setSelectedOption(event.target.value);
    setTimeout(() => {
      setButtonDisabled(false); // Enable the button after a delay
    }, 1500);
    console.log(event.target.value, "wtf");
  };

  const handleButtonClick = () => {
    // Navigate to qr-scanning with selectedOption in the URL
    navigate(`/qr-scanning/${selectedOption}`);
  };

  return (
    <div className="button-container">
      {isLoading ? (
        <p>Loading locations...</p>
      ) : (
        <React.Fragment>
          <select onChange={handleOptionChange}>
            {locations.map((location) => (
              <option
                key={location.scannerLocation_ID}
                value={location.scannerLocation_ID}
              >
                {location.location}
              </option>
            ))}
          </select>
          <button
            className={`custom-button ${buttonDisabled ? "inactive" : ""}`}
            onClick={handleButtonClick}
            disabled={buttonDisabled} // Set the disabled state of the button
          >
            Start Scanning
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export default Buttons;
