import React, { useState, useEffect } from "react";
import useScanDetection from "use-scan-detection-react18";

import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function ExternalScanner() {
  const [loading, setLoading] = useState(false);
  const [barcodeScan, setBarcodeScan] = useState("");
  const [fullName, setFullName] = useState("");
  const [qrError, setQRError] = useState("");
  const [loginType, setLoginType] = useState("");
  const [log, setLog] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [pic, setPic] = useState("");
  const [link, setLink] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4500);
  }, [barcodeScan]);

  //callback function that gets executed when a barcode scan is completed.
  const handleBarcodeComplete = (barcodeData) => {
    setLoading(true);
    setBarcodeScan(barcodeData);
    sendScannedDataToBackend(barcodeData);
  };

  useScanDetection({
    onComplete: handleBarcodeComplete,
    minLength: 3,
  });

  useEffect(() => {
    const oldScannedValue = localStorage.getItem("oldResultID");
    const newScannedValue = localStorage.getItem("resultID");

    setIsDuplicate(oldScannedValue === newScannedValue);
  }, [localStorage.getItem("oldResultID"), localStorage.getItem("resultID")]);
  
  
  console.log(localStorage.getItem("selectedOption"))
  const sendScannedDataToBackend = async (result) => {
    try {
      const selectedOption = localStorage.getItem("selectedOption");
      const response = await fetch("http://localhost:4440/logsz/saveQRLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_num: parseInt(result),
          scannerLocation_ID: parseInt(selectedOption),
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!data.result) {
        setQRError("Invalid QR");
      } else {
        setFullName(data.result.fullname);
        setLoginType(data.result.type);
        setLog(data.result.log);
        setPic(data.result.pic);

        const logDate = new Date(data.result.log);

        const optionsDate = { year: "numeric", month: "long", day: "numeric" };
        const formattedDateString = logDate.toLocaleDateString(
          "en-US",
          optionsDate
        );

        const optionsTime = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        };
        const formattedTimeString = logDate.toLocaleTimeString(
          "en-US",
          optionsTime
        );

        setFormattedDate(formattedDateString);
        setFormattedTime(formattedTimeString);

        setQRError(""); // Clear any previous error
      }

      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setQRError("Error sending data to backend");

      setTimeout(() => {
        setQRError("");
      }, 5000);
    }

    localStorage.setItem("resultID", result);
    console.log(localStorage.getItem("resultID"));
    console.log(result);
  };

  useEffect(() => {
    if (!pic) {
      setLink(defaultProfile);
    } else {
      setLink("https://app.supportzebra.net/" + pic);
    }
  }, [pic]);

  return (
    <div className="App">
      <>
        {!barcodeScan ? (
          <div id="reader"></div>
        ) : loading ? (
          <GridLoader color={"#198754"} loading={loading} size={100} />
        ) : (
          <div>
            <img className="profile" src={link} alt="Profile"></img>
            <br />
            <h2>
              {fullName && (
                <p>
                  Hi! {fullName} <br /> <br /> You have successfully logged{" "}
                  {loginType}. <br /> <br />
                  <br />
                  {formattedDate} {""} {formattedTime}
                </p>
              )}
              {qrError && <h1>{qrError}</h1>}
              {isDuplicate && <h1>DUPLICATE ENTRY!</h1>}
              <br />
            </h2>
          </div>
        )}
      </>
    </div>
  );
}

export default ExternalScanner;
