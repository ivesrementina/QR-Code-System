import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Buttons() {
  const [selectedOption, setSelectedOption] = useState("Rechub");
  const navigate = useNavigate(); // Import useNavigate from react-router-dom
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = () => {
    // Navigate to qrScanning.jsx when the button is clicked
    navigate("/qr-scanning?selectedOption=" + selectedOption);
  };

  const saveUserData = (selectedOption) => {
    // Replace this with your actual save logic
    console.log(`Saving user data for ${selectedOption}`);
    // Add your data-saving logic here
  };

  // Fetch data using GET method
  fetch("http://localhost/logsz/scannerLocations")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setData(data);
      setIsLoading(false);
    })
    .catch((error) => {
      // setError(error);
      setIsLoading(false);
    });

  useEffect(() => {
    console.log(data, "fetching?");
  }, [data]);
  return (
    <div className="button-container">
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        className="custom-dropdown"
      >
        <option value="Rechub">Rechub</option>
        <option value="OP1">OP1</option>
        <option value="OP2">OP2</option>
      </select>
      <button className="custom-button" onClick={handleButtonClick}>
        Start Scanning
      </button>
    </div>
  );
}

export default Buttons;
