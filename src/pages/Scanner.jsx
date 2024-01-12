// Scanner.js
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Scanner.css";

function Scanner({ onScanResultChange }) {
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);

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

      // Send the scanned QR code data to the backend
      sendScannedDataToBackend(result);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange]);

  const sendScannedDataToBackend = async (result) => {
    try {
      console.log(result);
      const response = await fetch("http://localhost:3001/api/scanned-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scanResult: result }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };
  useEffect(() => {
    if (!scanResult) return;

    sendScannedDataToBackend(scanResult);
  }, [scanResult]);
  return (
    <div id="scanner-cont">
      {scanResult ? (
        <div>
          <br />
          <h2>
            Success: <a href={scanResult}>{scanResult}</a>
          </h2>
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}

export default Scanner;
