import React, { useEffect, useState } from "react";
import useScanDetection from "use-scan-detection-react18";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function ExternalScanner({ onScanResultChange }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [fullName, setFullName] = useState("");
  const [qrError, setQRError] = useState("");
  const [loginType, setLoginType] = useState("");
  const [happyWorking, setHappyWorking] = useState("");
  const [log, setLog] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [pic, setPic] = useState("");
  const [link, setLink] = useState("");

  const [lastScanTime, setLastScanTime] = useState(
    () => Number(sessionStorage.getItem("lastScanTime")) || null
  );
  const navigate = useNavigate();

  const MINUTES_BEFORE_SCANNING_ALLOWED = 2;

  const { detectScan } = useScanDetection();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4500);
  }, [scanResult]);

  useEffect(() => {
    const handleScanDetected = (result) => {
      setScanResult(result);
      onScanResultChange(result);

      sessionStorage.setItem("lastScanTime", Date.now());
      setLastScanTime(Date.now());

      const selectedOption = localStorage.getItem("selectedOption");
      navigate(
        `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
      );

      // Ensure that setScanResult is called after navigation
      setTimeout(() => {
        setScanResult("");
      }, 0);

      sendScannedDataToBackend(result, selectedOption);
    };

    detectScan(handleScanDetected);

    return () => {
      // Clean up the scan detection when the component unmounts
      detectScan(null);
    };
  }, [detectScan, onScanResultChange, lastScanTime, navigate]);

  const sendScannedDataToBackend = async (result, selectedOption) => {
    try {
      // The rest of the function remains unchanged
      // ...

      localStorage.setItem("resultID", result);
      console.log(localStorage.getItem("resultID"));
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setQRError("Error sending data to backend");
    }

    setTimeout(() => {
      window.location.reload();
    }, 10000);
  };

  useEffect(() => {
    if (!pic) {
      setLink(defaultProfile);
    } else {
      setLink("https://app.supportzebra.net/" + pic);
    }
  }, [pic]);

  useEffect(() => {
    if (loginType === "in") {
      setHappyWorking("Happy Working :)");
    } else {
      setHappyWorking("Thank you for your service :)");
    }
  }, [loginType]);

  useEffect(() => {
    if (scanResult.length > 0) {
      const storedResult = localStorage.getItem("resultID");

      if (!storedResult) {
        localStorage.setItem("resultID", scanResult);
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      } else if (scanResult !== storedResult) {
        // Retrieve selectedOption from localStorage
        const selectedOption = localStorage.getItem("selectedOption");
        sendScannedDataToBackend(scanResult, selectedOption);
      }
      localStorage.setItem("oldResultID", storedResult);
      console.log(storedResult, scanResult);
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }
  }, [scanResult]);

  useEffect(() => {
    const oldScannedValue = localStorage.getItem("oldResultID");
    const newScannedValue = localStorage.getItem("resultID");

    setIsDuplicate(oldScannedValue === newScannedValue);
  }, [localStorage.getItem("oldResultID"), localStorage.getItem("resultID")]);

  return (
    <div id="scanner-cont">
      <>
        {!scanResult ? (
          <div id="reader"></div>
        ) : loading ? (
          <GridLoader color={"#198754"} loading={loading} size={100} />
        ) : (
          <div>
            <img className="profile" src={link} alt="User Profile"></img>
            <br />
            <h2>
              {fullName && (
                <p>
                  Hi! {fullName} <br /> <br /> You have successfully logged{" "}
                  {loginType}. <br /> <br />
                  {happyWorking} <br />
                  <br /> {formattedDate} {""} {formattedTime}
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
