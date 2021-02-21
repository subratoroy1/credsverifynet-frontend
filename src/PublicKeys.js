import React, { useState } from "react";
import "./PublicKeys.css";
import submitTransactionToBlockChain from "./restApiClient";
import { useStateValue } from "./StateProvider";

function PublicKeys() {
  const [{ user }, dispatch] = useStateValue();
  const [pubKey, setPubKey] = useState(null);
  const [serverResponseDiv1, setServerResponse1] = useState(null);
  const [serverResponseDiv2, setServerResponse2] = useState(null);

  const readFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setPubKey(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const onServerResponseReceived1 = (
    serverResponseData,
    serverResponseStatus
  ) => {
    setServerResponse1(
      <div className="aTextInput">
        <small className="aTextBox">{JSON.stringify(serverResponseData)}</small>
        <small className="aTextBox">
          {JSON.stringify(serverResponseStatus)}
        </small>
      </div>
    );
  };

  const onServerResponseReceived2 = (
    serverResponseData,
    serverResponseStatus
  ) => {
    setServerResponse2(
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
      <strong>Public Key Maintenance</strong>

      <div className="aTextInput">
        <small>Public Key File For Sharing On Blockchain</small>
        <input
          className="aTextBox"
          type="file"
          accept=".pem"
          onChange={(e) => readFile(e)}
        />
      </div>
      <button
        className="form_general_setKey"
        onClick={() =>
          submitTransactionToBlockChain(
            "AddAUniversityPublicKey",
            [user.email, pubKey].join("###|||"),
            onServerResponseReceived1
          )
        }
      >
        Change your public key
      </button>
      {serverResponseDiv1}
      <button
        className="form_general_getKey"
        onClick={() =>
          submitTransactionToBlockChain(
            "GetAUniversityPublicKey",
            [user.email].join("###|||"),
            onServerResponseReceived2
          )
        }
      >
        See your existing public key
      </button>
      {serverResponseDiv2}
    </div>
  );
}

export default PublicKeys;
