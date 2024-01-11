import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner({ onScanResultChange }) {
  const [scanResult, setScanResult] = useState("");
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const scannerElement = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 400,
        height: 400,
      },
      fps: 5,
    });

    setScanner(scannerElement);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {
    if (scanResult) {
      //do something with scanResult
      //search uid using the scanned result for evaluation sa database

      // after doing something, empties scanResult for next scanning
      setScanResult("");
    }
  }, [scanResult]);

  useEffect(() => {
    if (!scanner) return;

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
      // Notify parent component about the scan result change
      onScanResultChange(result);
    }

    function error(err) {
      console.warn(err);
    }

    // Cleanup when the component is unmounted
    return () => {
      scanner.clear();
    };
  }, [scanner, onScanResultChange]);

  return (
    <div>
      {scanResult ? (
        <div>
          <br />
          Success: <a href={scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}

export default Scanner;
