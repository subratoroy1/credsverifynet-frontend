import React, { useState } from "react";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function Header() {
  const [{ user }, dispatch] = useStateValue();
  const [navChoice, setNavChoice] = useState("/");

  const history = useHistory();

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      history.replace("/");
    }
  };

  const navigation = (event) => {
    history.push(event.target.value);
  };

  return (
    <div className="header">
      <div className="header__logo">
        <Link to="/">
          <strong className="header__logotext">CredsVerNet</strong>
        </Link>
      </div>

      <div className="header__rest">
        <span className="header__link">
          {user ? "Hello " + user.email : "Hello Guest"}
        </span>

        <select
          onChange={navigation}
          defaultValue={navChoice}
          value={navChoice}
          className="header__select"
          disabled={user ? false : true}
        >
          <option value="/" disabled>
            Credential Issuers
          </option>
          <option value="/publicKeyMaintenance">Public Key Maintenance</option>
          <option value="/IssuedDegrees">Existing Degrees</option>
          <option value="/IssueADegree">Issue A Degree</option>
          <option value="/IssuanceRequestsServicer">
            Issue Requests To Me
          </option>
        </select>

        <select
          onChange={navigation}
          defaultValue={navChoice}
          value={navChoice}
          className="header__select"
          disabled={user ? false : true}
        >
          <option value="/" disabled>
            Credential Owners
          </option>
          <option value="/MyCredentialsWallet">My Credentials Wallet</option>
          <option value="/RequestCredentialIssuance">
            New Credential Issue Request
          </option>
          <option value="/IssuanceRequestsRequestor">
            Issuance Requests From Me
          </option>
          <option value="/VerificationRequestsServicer">
            Verification Requests To Me
          </option>
        </select>

        <select
          onChange={navigation}
          defaultValue={navChoice}
          value={navChoice}
          className="header__select"
          disabled={user ? false : true}
        >
          <option value="/" disabled>
            Credential Verifiers
          </option>
          <option value="/RequestCredentials">New Credentials Request</option>
          <option value="/VerificationRequestsRequestor">
            Verification Requests From Me
          </option>
          <option value="/VerifySharedCredentials">
            Verify Credentials Received
          </option>
        </select>

        <Link to={!user && "/login"}>
          <strong className="header__link" onClick={handleAuthentication}>
            {user ? "Sign Out" : "Sign In"}
          </strong>
        </Link>
      </div>
    </div>
  );
}

export default Header;
