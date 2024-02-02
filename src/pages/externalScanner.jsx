import React, { useEffect, useState } from "react";
import useScanDetection from "use-scan-detection-react18";
import { useNavigate } from "react-router-dom";
import "./Scanner.css";
import { GridLoader } from "react-spinners";
import defaultProfile from "../images/user.png";

function ExternalScanner({}) {
  const [barcodeScan, setBarcodeScan] = useState("No Barcode Scanned");

  useScanDetection({
    onComplete: setBarcodeScan,
    minLength: 3,
  });
  return (
    <div className="App">
      <p>Barcode:{barcodeScan}</p>
    </div>
  );
}

export default ExternalScanner;
