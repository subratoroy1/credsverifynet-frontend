import React, { useState } from "react";
import { useStateValue } from "./StateProvider";
import "./IssueADegree.css";
import submitTransactionToBlockChain from "./restApiClient";

function RequestCredentialsFromOwner() {
  const [ownerNameOnBC, setOwnerNameOnBC] = useState("");
  const [credentialsRequested, setCredentialsRequested] = useState("");
  const [serverResponseDiv, setServerResponse] = useState(null);
  const [{ user }, dispatch] = useStateValue();

  const onServerResponseReceived = (
    serverResponseData,
    serverResponseStatus
  ) => {
    setServerResponse(
      <div className="aTextInput">
        <small className="aTextBox">{JSON.stringify(serverResponseData)}</small>
        <small className="aTextBox">
          {JSON.stringify(serverResponseStatus)}
        </small>
      </div>
    );
  };

  return (
    <div className="form_general">
      <div className="aTextInput">
        <small>Credential Owner Name on Blockchain</small>
        <input
          className="aTextBox"
          type="text"
          placeholder="Owner Name on Blockchain"
          onChange={(event) => setOwnerNameOnBC(event.currentTarget.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Description of credentials you want</small>
        <input
          className="aTextBox"
          type="text"
          placeholder="Description of credentials requested"
          onChange={(event) =>
            setCredentialsRequested(event.currentTarget.value)
          }
        ></input>
      </div>

      <div className="aTextInput">
        <button
          className="aTextBox"
          onClick={() =>
            submitTransactionToBlockChain(
              "VerifierRequestDegreeFromStudent",
              [ownerNameOnBC, user.email, credentialsRequested].join("###|||"),
              onServerResponseReceived
            )
          }
        >
          Send Request
        </button>
      </div>

      {serverResponseDiv}
    </div>
  );
}

export default RequestCredentialsFromOwner;
