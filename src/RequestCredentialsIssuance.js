import React, { useState } from "react";
import { useStateValue } from "./StateProvider";
import "./IssueADegree.css";
import submitTransactionToBlockChain from "./restApiClient";

function RequestCredentialsIssuance() {
  const [issuerNameOnBC, setIssuerNameOnBC] = useState("");
  const [
    ownerNameAtTimeOfAssociation,
    setOwnerNameAtTimeOfAssociation,
  ] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
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
        <small>University Admin user name on Blockchain</small>
        <input
          className="aTextBox"
          type="text"
          placeholder="University Admin user name on Blockchain"
          onChange={(event) => setIssuerNameOnBC(event.currentTarget.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Student name at time of degree</small>
        <input
          className="aTextBox"
          type="text"
          placeholder="Student name at time of degree"
          onChange={(event) =>
            setOwnerNameAtTimeOfAssociation(event.currentTarget.value)
          }
        ></input>
      </div>

      <div className="aTextInput">
        <small>Student Date of Birth</small>
        <input
          className="aTextBox"
          type="date"
          onChange={(event) => setDateOfBirth(event.currentTarget.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <button
          className="aTextBox"
          onClick={() =>
            submitTransactionToBlockChain(
              "UserRequestDegreeFromUni",
              [
                issuerNameOnBC,
                user.email,
                ownerNameAtTimeOfAssociation,
                dateOfBirth,
              ].join("###|||"),
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

export default RequestCredentialsIssuance;
