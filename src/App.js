import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect } from "react";
import { useStateValue } from "./StateProvider";
import "./App.css";
import ExistingDegreesIssued from "./ExistingDegreesIssued";
import Header from "./Header";
import IssueADegree from "./IssueADegree";
import PublicKeys from "./PublicKeys";

import Login from "./Login";
import { auth } from "./firebase";
import RequestCredentialsFromOwner from "./RequestCredentialsFromOwner";
import RequestsList from "./RequestsList";
import RequestCredentialsIssuance from "./RequestCredentialsIssuance";
import MyCredentialsWallet from "./MyCredentialsWallet";
import submitTransactionToBlockChain from "./restApiClient";

function App() {
  const [{}, dispatch] = useStateValue();

  //below keeps track of changes to a variable and then fires events based on that; a listener
  useEffect(() => {
    // will only run once when the app component loads as the array argument to useEffect is empty
    //below is the firebase listener, it fires every time there is a change in the authentication - login/logout
    auth.onAuthStateChanged((authUser) => {
      console.log("the user is >>> ", authUser);

      if (authUser) {
        // the user either just logged in or was already logged in previously
        dispatch({ type: "SET_USER", user: authUser });
        GetAllUserData(authUser);
      } else {
        //the user is logged out
        //dispatch({ type: "SET_USER", user: null });
        dispatch({ type: "SET_USER_NULL" });
      }
    });
  }, []);

  const GetAllUserData = (authUser) => {
    // Ger Records of the user
    submitTransactionToBlockChain(
      "GetAIDData",
      ["records_" + authUser?.email].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        let recordsArr =
          serverResponseData?.length === 0 || serverResponseData === null
            ? []
            : [].concat.apply(
                [],
                Object.keys(serverResponseData).map(
                  (elmt) => serverResponseData[elmt]
                )
              );

        dispatch({ type: "SET_RECORDS", recordsArr: recordsArr });
        // also get details of these records
        recordsArr.forEach((aRecordName) =>
          submitTransactionToBlockChain(
            "GetAIDData",
            [aRecordName].join("###|||"),
            (serverResponseData, serverResponseStatus) => {
              let aObj = JSON.parse(serverResponseData.DegreeData);
              aObj.Signature = serverResponseData.Signature;
              dispatch({
                type: "SET_RECORD_DETAILS",
                recordName: aRecordName,
                recordsDetails: aObj,
              });
            }
          )
        );
      }
    );

    // Get Verification Requests : User as SERVICER
    submitTransactionToBlockChain(
      "GetVerifierRequests",
      [authUser?.email, "SERVICER"].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        dispatch({
          type: "SET_VERIFICATION_REQUESTS_ME_SERVICER",
          verificationRequestsMeServicer: serverResponseData,
        });
      }
    );

    // Get Verification Requests : User as REQUESTOR
    submitTransactionToBlockChain(
      "GetVerifierRequests",
      [authUser?.email, "REQUESTOR"].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        dispatch({
          type: "SET_VERIFICATION_REQUESTS_ME_REQUESTOR",
          verificationRequestsMeRequestor: serverResponseData,
        });
      }
    );

    // Get Issuance Requests : User as REQUESTOR
    submitTransactionToBlockChain(
      "GetRequestsToUni",
      [authUser?.email, "REQUESTOR"].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        dispatch({
          type: "SET_ISSUANCE_REQUESTS_ME_REQUESTOR",
          issuanceRequestsMeRequestor: serverResponseData,
        });
      }
    );

    // Get Issuance Requests : User as SERVICER
    submitTransactionToBlockChain(
      "GetRequestsToUni",
      [authUser?.email, "SERVICER"].join("###|||"),
      (serverResponseData, serverResponseStatus) => {
        dispatch({
          type: "SET_ISSUANCE_REQUESTS_ME_SERVICER",
          issuanceRequestsMeServicer: serverResponseData,
        });
      }
    );
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/publicKeyMaintenance">
            <Header />
            <PublicKeys />
          </Route>

          <Route path="/IssuedDegrees">
            <Header />
            <ExistingDegreesIssued />
          </Route>

          <Route path="/IssueADegree">
            <Header />
            <IssueADegree />
          </Route>

          <Route path="/MyCredentialsWallet">
            <Header />
            <MyCredentialsWallet />
          </Route>

          <Route path="/RequestCredentialIssuance">
            <Header />
            <RequestCredentialsIssuance />
          </Route>

          <Route path="/IssuanceRequestsRequestor">
            <Header />
            <RequestsList
              userType="REQUESTOR"
              requestNameBC="GetRequestsToUni"
              key="1"
            />
          </Route>

          <Route path="/IssuanceRequestsServicer">
            <Header />
            <RequestsList
              userType="SERVICER"
              requestNameBC="GetRequestsToUni"
              key="2"
            />
          </Route>

          <Route path="/VerificationRequestsServicer">
            <Header />
            <RequestsList
              userType="SERVICER"
              requestNameBC="GetVerifierRequests"
              key="3"
            />
          </Route>

          <Route path="/VerificationRequestsRequestor">
            <Header />
            <RequestsList
              userType="REQUESTOR"
              requestNameBC="GetVerifierRequests"
              key="4"
            />
          </Route>

          <Route path="/RequestCredentials">
            <Header />
            <RequestCredentialsFromOwner />
          </Route>

          <Route path="/VerifySharedCredentials">
            <Header />
          </Route>

          <Route path="/Login">
            <Header />
            <Login />
          </Route>

          <Route path="/">
            <Header />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
