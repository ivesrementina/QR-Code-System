// Scanner.js
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useParams } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";

function Scanner({ onScanResultChange }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [qrError, setqrError] = useState("");
  const { selectedOption } = useParams(); // Get selectedOption from URL parameters

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0"); // Ensure two digits
  const ampm = hours <= 12 ? "AM" : "PM";
  const formattedHours = hours % 12 || 12;

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
    }
  };

  useEffect(() => {
    if (!scanResult) return;

    sendScannedDataToBackend(scanResult);
  }, [scanResult]);

  return (
    <div id="scanner-cont">
      {/* {loading ? (
        <GridLoader color={'#D0021B'} loading={loading} size={100} />
      ) : ( */}
      <>
        {!scanResult ? (
          <div id="reader"></div>
        ) : loading ? (
          <GridLoader color={"#D0021B"} loading={loading} size={100} />
        ) : (
          <div>
            <br />
            <h2>
              Hi! {fullName}
              <br /> <br />
              You have successfully logged in. Happy working :)
              <br />
              <br />
              {formattedHours}:{minutes} {ampm}
            </h2>
          </div>
        )}
      </>
      {/* )}  */}
    </div>
  );
}

export default Scanner;
