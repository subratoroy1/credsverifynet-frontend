import React, { useState } from "react";
import submitTransactionToBlockChain from "./restApiClient";
import { useStateValue } from "./StateProvider";
import "./ExistingDegreesIssued.css";
import "./grid-card.css";

function MyCredentialsWallet() {
  const [theState, dispatch] = useStateValue();

  return (
    <div>
      <h2>Your Credential Records</h2>
      <div className="cards">
        {theState.recordsArr.map((elmt) => (
          <div className="card">
            <strong className="aTextBox">{elmt}</strong>

            <table className="card-table">
              {Object.keys(theState[elmt]).map((key) => (
                <tr>
                  <td>{key + " : " + theState[elmt][key]}</td>
                </tr>
              ))}
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCredentialsWallet;
