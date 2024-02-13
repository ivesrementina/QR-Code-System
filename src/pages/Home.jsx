import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import zebraGif from "../images/happy.gif" 

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
        const scannerDataFull = data.scannerLocations;
        console.log("scannerDatasdfsdfsdf", scannerData);
        console.log("scannerDatasdfsdfsdf", scannerDataFull);

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
    setButtonDisabled(true);
    setSelectedOption(event.target.value);
    localStorage.setItem("selectedOption", event.target.value); // Store selectedOption in localStorage
    setTimeout(() => {
      setButtonDisabled(false);
    }, 1500);
    console.log(event.target.value, "yes");
  };

  const handleButtonClick = () => {
    // Navigate to qr-scanning
    localStorage.setItem("selectedOption", selectedOption); // Store selectedOption in localStorage
    navigate(`/qr-scanning`);
  };

  return (
    <div className="centerGif">
      <img className="zebraGif" src={zebraGif}></img>
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
            disabled={buttonDisabled}
          >
            Start Scanning
          </button>
        </React.Fragment>
      )}
    </div>
  </div>
  );
}

export default Buttons;
