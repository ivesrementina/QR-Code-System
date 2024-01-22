import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useParams, useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";

function Scanner({ onScanResultChange }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [qrError, setqrError] = useState("");
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

      // Check if the same QR is scanned within 2 minutes
      if (lastScanTime) {
        const diffMs = Math.abs(Date.now() - lastScanTime);
        const diffMin = Math.floor(diffMs / 1000 / 60);
        if (diffMin < MINUTES_BEFORE_SCANNING_ALLOWED) {
          // More than X minutes have passed
          setqrError(
            `Please wait ${MINUTES_BEFORE_SCANNING_ALLOWED} minute(s) before scanning again.`
          );
          return;
        }
      }

      // Update the last scan time
      sessionStorage.setItem("lastScanTime", new Date().getTime());
      setLastScanTime(new Date());

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
      }

      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setqrError("Error sending data to backend");
    }
  };

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
          <GridLoader color={"#D0021B"} loading={loading} size={100} />
        ) : (
          <div>
            <h2>
              Hi! {fullName} <br /> <br />
              You have successfully logged in. Happy working :)
              <br />
              {new Date().toLocaleTimeString()}
            </h2>
            {qrError && <p className="error-message">{qrError}</p>}
          </div>
        )}
      </>
    </div>
  );
}

export default Scanner;
