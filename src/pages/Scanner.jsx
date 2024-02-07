import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function Scanner({ onScanResultChange, action }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    () => Number(sessionStorage.getItem("lastScanTime")) || null
  );
  const navigate = useNavigate();

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

      // Get selectedOption from localStorage instead of URL params
      const selectedOption = localStorage.getItem("selectedOption");
      navigate(
        `/qr-scanning?selectedOption=${selectedOption}&lastScanResult=${result}`
      );

      // Ensure that setScanResult is called after navigation
      setTimeout(() => {
        setScanResult("");
      }, 0);

      const localCurrentTime = localStorage.getItem("currentTime");
      const localCurrentEmployee = localStorage.getItem("currentEmployee");
      const intervalTime = 120000;
      const isWithinTwoMinutes = false;

      if (result === localCurrentEmployee) {
        ///check if 2 mins na ang nilabay
        //compare localcurrent and Date.now();
        //

        if (isWithinTwoMinutes === true) {
          sendScannedDataToBackend(result, selectedOption);
        }
        setIsDuplicate(true);
      } else {
        sendScannedDataToBackend(result, selectedOption);
      }
    }

    function error(err) {}

    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange, lastScanTime, navigate]);

  const sendScannedDataToBackend = async (result, selectedOption) => {
    if (isSubmitting) {
      return;
    } else {
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
          console.log("https://app.supportzebra.net/" + data.result.pic);

          const logDate = new Date(data.result.log);
          //for time interval (getting current time scanned from DB)
          localStorage.setItem("currentTime", data.result.log);
          localStorage.setItem("currentEmployee", data.result.id_num);

          // Format date
          const optionsDate = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
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

          // Ensure that setQRError is called after processing data
          setQRError(""); // Clear any previous error
        }

        setTimeout(() => {
          window.location.reload();
        }, 10000);
      } catch (error) {
        console.error("Error sending data to backend:", error);
        setQRError("Error sending data to backend");
      }

      localStorage.setItem("resultID", result);
      console.log(localStorage.getItem("resultID"));
    }

    setIsSubmitting(false);
  };

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

  return (
    <div id="scanner-cont">
      <>
        {!scanResult ? (
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
