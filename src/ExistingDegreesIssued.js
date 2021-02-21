import React, { useState } from "react";
import submitTransactionToBlockChain from "./restApiClient";
import { useStateValue } from "./StateProvider";
import "./ExistingDegreesIssued.css";

function ExistingDegreesIssued() {
  const [{ user }, dispatch] = useStateValue();
  const [serverResponseDiv, setServerResponseDiv] = useState(null);

  const onServerResponseReceived = (
    serverResponseData,
    serverResponseStatus
  ) => {
    serverResponseData.length === 0
      ? setServerResponseDiv(
          <div className="aTextInput">
            <small className="aTextBox">No Degrees Issued By You</small>
          </div>
        )
      : setServerResponseDiv(
          serverResponseData.map((obj, i) => (
            <div className="aListItem" key={i}>
              <div className="aTextInput">
                <strong className="aTextBox">
                  {"Degree Number : " + (i + 1)}
                </strong>
              </div>

              {Object.keys(obj).map((key) => (
                <div className="aTextInput">
                  <small className="aTextBox">{key + " : " + obj[key]}</small>
                </div>
              ))}
            </div>
          ))
        );
  };
  return (
    <div className="form_general">
      <strong>List of degrees issued by your University</strong>
      <button
        className="form_general_setKey"
        onClick={() =>
          submitTransactionToBlockChain(
            "GetRequests",
            ["universityDegree_", user.email, "NONE"].join("###|||"),
            onServerResponseReceived
          )
        }
      >
        check now
      </button>
      {serverResponseDiv}
    </div>
  );
}

export default ExistingDegreesIssued;
