import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function Scanner({ onScanResultChange, action }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [qrError, setQRError] = useState("");
  const [loginType, setLoginType] = useState("");
  const [happyWorking, setHappyWorking] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [pic, setPic] = useState("");
  const [link, setLink] = useState("");
  const [lastScanTime, setLastScanTime] = useState(
    () => Number(localStorage.getItem("lastScanTime")) || null
  );
  const navigate = useNavigate();

  function success(result) {
    setScanResult(result);
    onScanResultChange(result);
    localStorage.setItem("lastScanTime", Date.now());
    setLastScanTime(Date.now());
    const selectedOption = localStorage.getItem("selectedOption");
    navigate(
      `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
    );

    setTimeout(() => {
      setScanResult("");
    }, 0);
  }

  function error(err) {
    // Handle error
  }

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
      fps: 20,
    });
    setScanner(scannerElement);
    return () => {
      scannerElement.clear();
    };
  }, []);

  useEffect(() => {
    if (!scanner) return;
    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange, scanResult]);

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

      if (!data.result) {
        setQRError(
          "Invalid QR code. Please scan only a Support Zebra dedicated QR code."
        );
        action(false);
      } else {
        action(false);
        setFullName(data.result.fullname);
        setLoginType(data.result.type);
        setPic(data.result.pic);

        const logDate = new Date(data.result.log);
        localStorage.setItem("currentTime", data.result.log);
        localStorage.setItem("currentEmployee", data.result.id_num);

        const optionsDate = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
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
    }
    console.log(scanner);
    localStorage.setItem("resultID", result);
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

  function checkIntervalTime(lastScanTime, currentTime, intervalTime) {
    const elapsedTime = currentTime - lastScanTime;
    return elapsedTime <= intervalTime;
  }

  useEffect(() => {
    if (scanResult.length > 0) {
      const storedResult = localStorage.getItem("resultID");

      if (scanResult === storedResult) {
        const localCurrentTime = localStorage.getItem("currentTime");
        const intervalTime = 120000;

        const elapsedTime = Date.now() - parseInt(localCurrentTime);
        console.log("Elapsed Time:", elapsedTime);
        const isWithinTwoMinutes = checkIntervalTime(
          parseInt(localCurrentTime),
          Date.now(),
          intervalTime
        );
        console.log("Is Within Two Minutes:", isWithinTwoMinutes);
        console.log(elapsedTime, "elapsedTime");
        setIsDuplicate(true);
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }
      if (!storedResult) {
        localStorage.setItem("resultID", scanResult);

        scanner.clear();
      } else if (scanResult !== storedResult) {
        const selectedOption = localStorage.getItem("selectedOption");

        sendScannedDataToBackend(scanResult, selectedOption);
      }

      localStorage.setItem("oldResultID", storedResult);
      console.log(storedResult);
      console.log(scanResult);
    }
  }, [scanResult]);

  return (
    <div id="scanner-cont">
      <div id="reader"></div>
      {scanResult && loading ? (
        <GridLoader color={"#198754"} loading={loading} size={100} />
      ) : (
        <div>
          <img className="profile" src={link}></img>
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
            {isDuplicate && (
              <h1>DUPLICATE ENTRY. You can scan after 2 mins!</h1>
            )}
            <br />
          </h2>
        </div>
      )}
    </div>
  );
}
export default Scanner;
