import React, { useEffect, useState } from "react";
import useScanDetection from "use-scan-detection";
import "./externalScanner.css";

function ExternalScanner() {
  const [barcodeScan, setBarcodeScan] = useState("No barcode Scanned");

  useScanDetection({
    onComplete: setBarcodeScan,
    minLength: 3,
  });

  return (
    <div className="external-scanner" style={{ padding: "5rem 10rem" }}>
      <p>Barcode: {barcodeScan}</p>
    </div>
  );
}

export default ExternalScanner;
