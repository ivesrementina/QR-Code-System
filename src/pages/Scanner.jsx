import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

<<<<<<< HEAD
function Scanner({ onScanResultChange }) {
  const [isScan, setIsScan] = useState(true)
=======
function Scanner({ onScanResultChange, action }) {
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38
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
    const localCurrentTime = localStorage.getItem("currentTime");
    const localCurrentEmployee = localStorage.getItem("currentEmployee");
    const intervalTime = 120000; // 2 minutes in milliseconds
    console.log("Local Current Time:", parseInt(localCurrentTime));
    console.log("Local Current Employee:", localCurrentEmployee);
    console.log("Current Time:", Date.now());

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

    if (result === localCurrentEmployee ) {
      const elapsedTime = Date.now() - parseInt(localCurrentTime);
      console.log("Elapsed Time:", elapsedTime);
      const isWithinTwoMinutes = checkIntervalTime(
        parseInt(localCurrentTime),
        Date.now(),
        intervalTime
      );
      console.log("Is Within Two Minutes:", isWithinTwoMinutes);
      setIsDuplicate(isWithinTwoMinutes);
    } else {
      sendScannedDataToBackend(result, selectedOption);
    }
  }

  function error(err) {
    // Handle error
  }

  const initializeScanner = () => {
    const scannerElement = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 300,
        height: 300,
      },
      fps: 5,
    });
<<<<<<< HEAD
  
    setScanner(scannerElement);
  
=======
    setScanner(scannerElement);
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38
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


<<<<<<< HEAD
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
=======
  
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38

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
<<<<<<< HEAD
      console.log("Backend response:", data);
      setIsScan(true)
=======
      console.log("kaabot dari");
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38

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
        // window.location.reload();
        setIsScan(true)
      }, 10000);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setQRError("Error sending data to backend");
    }

    localStorage.setItem("resultID", result);
  };

<<<<<<< HEAD
  // clear instance

  // over all link to access image
  // const link = "https://app.supportzebra.net/" + pic;
=======
  useEffect(() => {
    if (!scanner) return;
    scanner.render(success, error);
    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange, navigate, isDuplicate]);

  function checkIntervalTime(lastScanTime, currentTime, intervalTime) {
    const elapsedTime = currentTime - lastScanTime;
    return elapsedTime <= intervalTime;
  }
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38

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
        const selectedOption = localStorage.getItem("selectedOption");
        sendScannedDataToBackend(scanResult, selectedOption);
      }

      localStorage.setItem("oldResultID", storedResult);
      console.log(storedResult);
      console.log(scanResult);

      setTimeout(() => {
<<<<<<< HEAD
        // window.location.reload();
        setIsScan(true)
=======
        localStorage.removeItem(storedResult);
        localStorage.removeItem(scanResult);
        window.location.reload();
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38
      }, 10000);
    }
  }, [scanResult]);

<<<<<<< HEAD
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
=======
  return (
    <div id="scanner-cont">
      {!scanResult ? (
        <div id="reader"></div>
      ) : loading ? (
        <GridLoader color={"#198754"} loading={loading} size={100} />
      ) : (
        <div>
          <img className="profile" src={link} alt="Profile" />
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
              <h1>Duplicate Entry. Please scan after 2 minutes</h1>
            )}
            <br />
          </h2>
        </div>
      )}
>>>>>>> 8161adfc27b054ac1e8ce937ccb7dad07200ef38
    </div>
  );
}

export default Scanner;
