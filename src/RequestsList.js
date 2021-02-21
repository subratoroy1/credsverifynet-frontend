import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import submitTransactionToBlockChain from "./restApiClient";
import "./IssueADegree.css";
import "./grid-card.css";
import VerifyCreds from "./VerifyCreds";

function RequestsList({ userType, requestNameBC }) {
  const [theState, dispatch] = useStateValue();

  const [recordsArray, setRecordsArray] = useState(
    theState.recordsArr.map((elmt) => ({ label: elmt, value: elmt }))
  );
  const [chosenRequestKey, setChosenRequestKey] = useState("");
  const [toShareRecordsMap, setToShareRecordsMap] = useState({});
  const [toShareRecords, setToShareRecords] = useState([]);
  const [editRequestObjString, setEditRequestObjString] = useState("");
  const [serverResponseDiv, setServerResponseDiv] = useState(null);

  const requestsMapper = (requestNameBC, userType) => {
    let theTitle = "";
    let responseTitle = "";
    let requestArr = [];
    let displayResponseButton = false;
    let displayVerification = false;
    switch (requestNameBC + "_" + userType) {
      case "GetRequestsToUni_REQUESTOR":
        theTitle = "Issuance requests raised by you";
        responseTitle =
          "If requestStatus is COMPLETE, you will be able to see the credential details below";
        requestArr = theState.issuanceRequestsMeRequestor;
        break;
      case "GetRequestsToUni_SERVICER":
        theTitle = "Issuance requests made to you";
        responseTitle =
          "To Issue a Degree, go to 'Issue A Degree' under 'Credential Issuers' menu";
        requestArr = theState.issuanceRequestsMeServicer;
        break;
      case "GetVerifierRequests_REQUESTOR":
        theTitle = "Verification requests raised by you";
        responseTitle =
          "If requestStatus is COMPLETE, choose the specific record and verify below";
        requestArr = theState.verificationRequestsMeRequestor;
        displayVerification = true;
        break;
      case "GetVerifierRequests_SERVICER":
        theTitle = "Verification requests made to you";
        responseTitle =
          "Choose Credentials To Share Against the Verification Request";
        requestArr = theState.verificationRequestsMeServicer;
        displayResponseButton = true;
        break;
      default:
    }

    return {
      requestArr: requestArr,
      theTitle: theTitle,
      responseTitle: responseTitle,
      displayResponseButton: displayResponseButton,
      displayVerification: displayVerification,
    };
  };

  const RM = requestsMapper(requestNameBC, userType);
  const [requestArr, setRequestArr] = useState(RM.requestArr);
  const [chosenRequestData, setChosenRequestData] = useState(
    RM.requestArr ? RM.requestArr[0] : null
  );
  const [requestTitle, setRequestTitle] = useState(RM.theTitle);
  const [responseTitle, setResponseTitle] = useState(RM.responseTitle);
  const [displayResponseButton, setDisplayResponseButton] = useState(
    RM.displayResponseButton
  );
  const [displayVerification, setDisplayVerification] = useState(
    RM.displayVerification
  );

  const handleRequestChoice = (event) => {
    console.log("fillDefaults : going to find index");
    setChosenRequestKey(event.target.value);
    let index = requestArr.findIndex(
      (elmt) => elmt.key1 === event.target.value
    );
    setChosenRequestData(requestArr[index]);
  };

  const handleToShareRecordChoice = (event, recordID) => {
    setToShareRecordsMap({
      ...toShareRecordsMap,
      [recordID]: event.target.checked,
    });
    // filter out all keys of toShareRecordsMap that are true
    let tsr = event.target.checked ? [recordID] : [];
    let selectedItems = Object.keys(toShareRecordsMap).filter(
      (key) => toShareRecordsMap[key] === true && key !== recordID
    );
    tsr = tsr.concat(selectedItems);
    setToShareRecords(tsr);
    //setEditRequestObjString
    //Make the object string that is to be shared
    let obj = {
      recordIDs: tsr,
      requestStatus: "COMPLETE",
      servicingDate: new Date(),
    };
    let objString = JSON.stringify(obj);
    setEditRequestObjString(objString);
  };

  return (
    <div>
      <h2>{requestTitle}</h2>
      <div className="cards">
        <div className="card">
          <select onChange={handleRequestChoice} onSelect={handleRequestChoice}>
            {requestArr?.map((elmt, i) => (
              <option key={i} value={elmt.key1}>
                {elmt.key1}
              </option>
            ))}
          </select>

          <table>
            {chosenRequestData
              ? Object.keys(chosenRequestData).map((key) => (
                  <tr>
                    <td> {key + " : " + chosenRequestData[key]}</td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
      <h3>{responseTitle}</h3>
      <div className="cards">
        {theState.recordsArr?.map((elmt, i) => (
          <div className="card">
            <strong className="aTextBox">{elmt}</strong>

            <table className="card-table">
              {Object.keys(theState[elmt])?.map((key, i) => (
                <tr key={i}>
                  <td>{key + " : " + theState[elmt][key]}</td>
                </tr>
              ))}
            </table>
            <input
              type="checkbox"
              name="Share"
              key={elmt}
              onChange={(e) => handleToShareRecordChoice(e, elmt)}
            ></input>
          </div>
        ))}
      </div>
      {displayResponseButton && (
        <button
          onClick={() => {
            setServerResponseDiv(null);
            submitTransactionToBlockChain(
              "EditARequest",
              [chosenRequestData?.key1, editRequestObjString].join("###|||"),
              (serverResponseData, serverResponseStatus) => {
                setServerResponseDiv(JSON.stringify(serverResponseStatus));
              }
            );
          }}
        >
          Send Response To Verification Request
        </button>
      )}
      {displayVerification && (
        <VerifyCreds chosenRequestData={chosenRequestData} />
      )}
      {serverResponseDiv}
    </div>
  );
}

export default RequestsList;
