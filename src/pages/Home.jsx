import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Buttons() {
  const [selectedOption, setSelectedOption] = useState("");
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
        setSelectedOption(scannerData.location);
        setLocations(data.scannerLocations);
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error
        setIsLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   // Fetch data using GET method when the component mounts
  //   fetch(`http://localhost:4440/logsz/scannerLocations`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Received data:", data); // Log received data
  //       setLocations(data.scannerLocations);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error); // Log error
  //       setIsLoading(false);
  //     });
  // }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = () => {
    // Navigate to qrScanning.jsx when the button is clicked
    navigate(`/qr-scanning?selectedOption=${selectedOption}`);
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
                key={location.companyLocation_ID}
                value={location.companyLocation_ID}
              >
                {location.location}
              </option>
            ))}
          </select>
          <button className="custom-button" onClick={handleButtonClick}>
            Start Scanning
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export default Buttons;
