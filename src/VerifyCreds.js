import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import submitTransactionToBlockChain from "./restApiClient";
import { verifySignature } from "./CryptoFunctions.js";

function VerifyCreds({ chosenRequestData }) {
  const [theState, dispatch] = useStateValue();
  // recordIDs once provided will be all extracted from BC and then stored in State
  const [recordIDs, setRecordIDs] = useState(
    chosenRequestData ? chosenRequestData.recordIDs : []
  );
  const [selectedRecordID, setSelectedRecordID] = useState(
    chosenRequestData ? chosenRequestData.recordIDs[0] : ""
  );
  const [selectedIssuerID, setSelectedIssuerID] = useState(
    chosenRequestData ? chosenRequestData.recordIDs[0].split("_")[1] : ""
  );
  const [allRecordsData, setAllRecordsData] = useState({});
  const [publicKey, setPublicKey] = useState("");
  const [selectedRecordData, setSelectedRecordData] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  // issuer name of the credential will be extracted from the record
  useEffect(() => {
    //Get all records data
    recordIDs.forEach((aRecordName) =>
      submitTransactionToBlockChain(
        "GetAIDData",
        [aRecordName].join("###|||"),
        (serverResponseData, serverResponseStatus) => {
          let aObj = JSON.parse(serverResponseData.DegreeData);
          aObj.Signature = serverResponseData.Signature;
          setAllRecordsData({ ...allRecordsData, [aRecordName]: aObj });
          if (aRecordName === selectedRecordID) setSelectedRecordData(aObj);
        }
      )
    );
    //Get the public key
    submitTransactionToBlockChain(
      "GetAUniversityPublicKey",
      [selectedIssuerID].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        setPublicKey(serverResponseData?.PublicKey);
      }
    );
  }, []);

  const handleRecordIDSelect = (event) => {
    setSelectedRecordID(event.target.value);
    setSelectedRecordData(allRecordsData[event.target.value]);
  };

  const verifyData = () => {
    let signature = selectedRecordData.Signature;
    let aObj = {};
    Object.assign(aObj, selectedRecordData);
    delete aObj.Signature;
    let aObjString = JSON.stringify(aObj);
    console.log("Signature : " + signature);
    console.log("ObjString : " + aObjString);
    console.log("publicKey : " + publicKey);
    let result = verifySignature(signature, aObjString, publicKey);
    setVerificationResult(result);
  };

  return (
    <div className="cards">
      <select onChange={handleRecordIDSelect} onSelect={handleRecordIDSelect}>
        {recordIDs?.map((elmt, i) => (
          <option key={i} value={elmt}>
            {elmt}
          </option>
        ))}
      </select>

      <h3>{selectedIssuerID}</h3>
      <div className="card">
        <h4>Credential data and Signature</h4>
        <table className="card-table">
          {selectedRecordData
            ? Object.keys(selectedRecordData).map((key, i) => (
                <tr key={i}>
                  <td> {key + " : " + selectedRecordData[key]}</td>
                </tr>
              ))
            : null}
        </table>
      </div>
      <div className="card">
        <h4>Issuer's Public Key</h4>
        <small>{publicKey}</small>
      </div>

      <button onClick={() => verifyData()}>Verify</button>
      {!(verificationResult === null) && (
        <strong>{"Verification passed = " + verificationResult}</strong>
      )}
    </div>
  );
}

export default VerifyCreds;
