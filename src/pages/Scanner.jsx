import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function Scanner({ onScanResultChange }) {
  const [isScan, setIsScan] = useState(true)
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
  const [pic, setPic] = useState("");
  const [link, setLink] = useState("");

  const [lastScanTime, setLastScanTime] = useState(
    () => Number(sessionStorage.getItem("lastScanTime")) || null
  );
  const navigate = useNavigate();

  const MINUTES_BEFORE_SCANNING_ALLOWED = 2;

  const initializeScanner = () => {
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

  }

  useEffect(() => {
   initializeScanner();
  }, []);
 

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4500);
  }, [scanResult]);


  useEffect(() => {
    if (!scanner) return;
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);

      onScanResultChange(result);

      sessionStorage.setItem("lastScanTime", Date.now());
      setLastScanTime(Date.now());

      // Get selectedOption from localStorage instead of URL params
      const selectedOption = localStorage.getItem("selectedOption");
      navigate(
        `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
      );

      // Ensure that setScanResult is called after navigation
      setTimeout(() => {
        setScanResult("");
      }, 0);

      sendScannedDataToBackend(result, selectedOption);
    }

    function error(err) {
      // console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange, lastScanTime, navigate]);

  const sendScannedDataToBackend = async (result, selectedOption) => {
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
      setIsScan(true)

      if (!data.result) {
        setQRError("Invalid QR");
      } else {
        setFullName(data.result.fullname);
        setLoginType(data.result.type);
        setLog(data.result.log);
        setPic(data.result.pic);
        console.log("https://app.supportzebra.net/" + data.result.pic);

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
        // window.location.reload();
        setIsScan(true)
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setQRError("Error sending data to backend");
    }

    localStorage.setItem("resultID", result);
    console.log(localStorage.getItem("resultID"));
  };

  // clear instance

  // over all link to access image
  // const link = "https://app.supportzebra.net/" + pic;

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
      setIsScan(false)
      const storedResult = localStorage.getItem("resultID");

      if (!storedResult) {
        localStorage.setItem("resultID", scanResult);
        setTimeout(() => {
          // window.location.reload();
          setIsScan(true)
        }, 10000);
      } else if (scanResult !== storedResult) {
        // Retrieve selectedOption from localStorage
        const selectedOption = localStorage.getItem("selectedOption");
        sendScannedDataToBackend(scanResult, selectedOption);
      }
      localStorage.setItem("oldResultID", storedResult);
      console.log(storedResult, scanResult);
      setTimeout(() => {
        // window.location.reload();
        setIsScan(true)
      }, 10000);
    }
  }, [scanResult]);

  console.log(scanResult)

  useEffect(() => {
    const oldScannedValue = localStorage.getItem("oldResultID");
    const newScannedValue = localStorage.getItem("resultID");
console.log(log)
    setIsDuplicate(oldScannedValue === newScannedValue );
  }, [localStorage.getItem("oldResultID"), localStorage.getItem("resultID")]);
 
  return (
    <div id="scanner-cont">
      <>
        {isScan ? (
          <div id="reader"></div>
        ) : loading ? (
          <GridLoader color={"#198754"} loading={loading} size={100} />
        ) : (
          <div>
            <img className="profile" src={link}></img>
            <br />
            <h2>
            {fullName && (
              <p>
                  <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>Hi!</span>{" "}
                  <span style={{ color: "green" }}>{fullName}</span> <br /> <br />
                  <span style={{ fontSize: "0.7em" }}>You have successfully logged</span>{" "}
                  <span style={{ color: "green", fontWeight: "bold", textTransform: "uppercase" }}>{loginType}</span>
                  . <br /> <br /> 
                  <span style={{ fontSize: "0.7em" }}>{happyWorking}</span> <br />
                  <br />
                  <span style={{ fontWeight: "bold", fontSize: "0.8em" }}>{formattedDate}</span>{" "}{""}
                  <span style={{ fontWeight: "bold", fontSize: "0.8em" }}>{formattedTime}</span>
              </p>
            )}
              {qrError && <h1>{qrError}</h1>}
              {isDuplicate && <h1>DUPLICATE ENTRY!</h1>}
              <br />
              <br />
            </h2>
          </div>
        )}
      </>
    </div>
  );
}

export default Scanner;
