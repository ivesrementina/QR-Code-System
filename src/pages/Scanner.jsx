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
  const [qrError, setQRError] = useState("");
  const [loginType, setLoginType] = useState("");
  const [happyWorking, setHappyWorking] = useState("");
  const [log, setLog] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const { selectedOption } = useParams();
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

    return () => {
      scannerElement.clear();
    };
  }, []);

  useEffect(() => {
    if (!scanner) return;

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);

      onScanResultChange(result);

      sessionStorage.setItem("lastScanTime", Date.now());
      setLastScanTime(Date.now());

      navigate(
        `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
      );

      // Ensure that setScanResult is called after navigation
      setTimeout(() => {
        setScanResult("");
      }, 0);

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
        const logDate = new Date(data.result.log);

        // Format date
        const optionsDate = { year: "numeric", month: "long", day: "numeric" };
        const formattedDateString = logDate.toLocaleDateString(
          "en-US",
          optionsDate
        );

        // Format time
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
      }

      // Ensure that setQRError is called after processing data
      setTimeout(() => {
        setQRError("");
      }, 0);

      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setQRError("Error sending data to backend");
    }

    localStorage.setItem("resultID", result);
    console.log(localStorage.getItem("resultID"));
  };

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
        sendScannedDataToBackend(scanResult);
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

export default Scanner;
