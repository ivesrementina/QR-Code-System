import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useParams, useNavigate } from "react-router-dom";
import { DateTime } from "luxon"; // Import DateTime from luxon
import "./Scanner.css";
import { GridLoader } from "react-spinners";

function Scanner({ onScanResultChange }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [qrError, setqrError] = useState("");
  const [loginType, setloginType] = useState("");
  const [happyWorking, setHappyWorking] = useState("");
  const [log, setLog] = useState("");

  const { selectedOption } = useParams(); // Get selectedOption from URL parameters
  const [lastScanTime, setLastScanTime] = useState(
    () => Number(sessionStorage.getItem("lastScanTime")) || null
  );
  const navigate = useNavigate();

  const MINUTES_BEFORE_SCANNING_ALLOWED = 2;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4500);
  }, [scanResult]);

  useEffect(() => {
    const scannerElement = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 300,
        height: 300,
      },
      fps: 5,
    });

    setScanner(scannerElement);
  }, []);

  useEffect(() => {
    if (!scanner) return;

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);

      // Notify parent component about the scan result change
      onScanResultChange(result);

      // Update the last scan time
      sessionStorage.setItem("lastScanTime", Date.now());
      setLastScanTime(Date.now());

      // Add the last successful scan result to the URL
      navigate(
        `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
      );
      // Send the scanned QR code data to the backend
      sendScannedDataToBackend(result);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange, lastScanTime, navigate, selectedOption]);

  const sendScannedDataToBackend = async (result) => {
    try {
      console.log(result);

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
        setqrError("Invalid QR");
      } else {
        setFullName(data.result.fullname);
        setloginType(data.result.type);
        setLog(data.result.log);
      }

      console.log(data.status);
      console.log(data.result.type);
      console.log(data.result.log);

      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setqrError("Error sending data to backend");
    }
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  };

  useEffect(() => {
    if (loginType === "in") {
      setHappyWorking("Happy Working :)");
    } else {
      setHappyWorking("Thank you for your service :) ");
    }
  }, [loginType]);

  useEffect(() => {
    if (!scanResult) return;

    sendScannedDataToBackend(scanResult);
  }, [scanResult]);

  return (
    <div id="scanner-cont">
      <>
        {!scanResult ? (
          <div id="reader"></div>
        ) : loading ? (
          <GridLoader color={"#198754"} loading={loading} size={100} />
        ) : (
          <div>
            <h2>
              {fullName && (
                <p>
                  Hi! {fullName} <br /> <br /> You have successfully logged{" "}
                  {loginType}. <br /> <br />
                  {happyWorking} <br />
                  <br /> {log}
                </p>
              )}{" "}
              {qrError && <h1>INVALID QR</h1>}
              <br />
            </h2>
          </div>
        )}
      </>
    </div>
  );
}

export default Scanner;
