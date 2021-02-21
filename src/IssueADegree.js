import React, { useState } from "react";
import "./IssueADegree.css";
import submitTransactionToBlockChain from "./restApiClient";
import { useStateValue } from "./StateProvider";
import { signDataOrFile } from "./CryptoFunctions.js";

function IssueADegree() {
  const [{ user }, dispatch] = useStateValue();
  const [listOfRequestKeys, setListOfRequestKeys] = useState([]);
  const [listOfNetworkNames, setListOfNetworkNames] = useState([]);
  const [listOfFullNames, setListOfFullNames] = useState([]);
  const [networkNameOfStudent, setNetworkNameOfStudent] = useState("");
  const [chosenKey, setChosenKey] = useState("");
  const [fullNameOfStudent, setFullNameOfStudent] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [nameOfDegree, setNameOfDegree] = useState("");
  const [placeOfAttendance, setPlaceOfAttendance] = useState("");
  const [attendedFrom, setAttendedFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendedTill, setAttendedTill] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [degreeIssueDate, setDegreeIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [marksObtained, setMarksObtained] = useState("");
  const [serverResponseDiv, setServerResponse] = useState(null);
  const [privKey, setPrivKey] = useState(null);

  const refreshKeysClick = (serverResponseData, serverResponseStatus) => {
    let keys = [];
    let netNames = [];
    let fullNames = [];
    serverResponseData.forEach((obj) => {
      keys.push(obj.key1);
      netNames.push(obj.StudentUserName);
      fullNames.push(obj.StudentNameAtTimeofDegree);
    });

    setListOfRequestKeys(keys);
    setListOfNetworkNames(netNames);
    setListOfFullNames(fullNames);
    // Given the top element will become selected, fill Defaults
    if (keys.length >= 1) {
      setNetworkNameOfStudent(netNames[0]);
      setFullNameOfStudent(fullNames[0]);
      setChosenKey(keys[0]);
    }
  };

  const fillDefaults = (event) => {
    console.log("fillDefaults : going to find index");
    setChosenKey(event.target.value);
    let index = listOfRequestKeys.findIndex(
      (elmt) => elmt === event.target.value
    );
    console.log("fillDefaults : index - " + index);
    console.log(listOfNetworkNames[index]);
    setNetworkNameOfStudent(listOfNetworkNames[index]);
    setFullNameOfStudent(listOfFullNames[index]);
  };

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

  const readFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setPrivKey(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const signAndSubmit = async (degreeData) => {
    //DegreeData is an object
    //Create the digital signature
    let degreeDataString = JSON.stringify(degreeData);

    let signature = signDataOrFile(degreeDataString, privKey);

    console.log("produced a signature : " + signature);
    submitTransactionToBlockChain(
      "UniversityIssueDegree",
      [
        user.email,
        networkNameOfStudent,
        degreeDataString,
        signature,
        chosenKey,
      ].join("###|||"),
      onServerResponseReceived
    );
  };

  return (
    <div className="form_general">
      <strong>Provide Degree Details</strong>

      <div className="aTextInput">
        <button
          onClick={() =>
            submitTransactionToBlockChain(
              "GetRequestsToUni",
              [user.email, "SERVICER"].join("###|||"),
              refreshKeysClick
            )
          }
        >
          Refresh Issuance Request Keys
        </button>
        <select
          className="aTextBox"
          onChange={fillDefaults}
          onSelect={fillDefaults}
        >
          {listOfRequestKeys.map((elmt, i) => (
            <option key={i} value={elmt}>
              {elmt}
            </option>
          ))}
        </select>
      </div>

      <div className="aTextInput">
        <small>Network UserName of Student</small>
        <input
          className="aTextBox"
          type="text"
          value={networkNameOfStudent}
          onChange={(e) => setNetworkNameOfStudent(e.target.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Full Name of Student</small>
        <input
          className="aTextBox"
          type="text"
          value={fullNameOfStudent}
          onChange={(e) => setFullNameOfStudent(e.target.value)}
          placeholder="Full Name of student"
        ></input>
      </div>

      <div className="aTextInput">
        <small>Date Of Birth</small>
        <input
          className="aTextBox"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Place of Birth</small>
        <input
          className="aTextBox"
          type="text"
          value={placeOfBirth}
          onChange={(e) => setPlaceOfBirth(e.target.value)}
          placeholder="Place of Birth"
        ></input>
      </div>

      <div className="aTextInput">
        <small>Name of Degree</small>
        <input
          className="aTextBox"
          type="text"
          value={nameOfDegree}
          onChange={(e) => setNameOfDegree(e.target.value)}
          placeholder="Name of Degree"
        ></input>
      </div>

      <div className="aTextInput">
        <small>Place of attendance</small>
        <input
          className="aTextBox"
          type="text"
          value={placeOfAttendance}
          onChange={(e) => setPlaceOfAttendance(e.target.value)}
          placeholder="Place of attendance"
        ></input>
      </div>

      <div className="aTextInput">
        <small>Attended From</small>
        <input
          className="aTextBox"
          type="date"
          value={attendedFrom}
          onChange={(e) => setAttendedFrom(e.target.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Attended Till</small>
        <input
          className="aTextBox"
          type="date"
          value={attendedTill}
          onChange={(e) => setAttendedTill(e.target.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Degree Issue Date</small>
        <input
          className="aTextBox"
          type="date"
          value={degreeIssueDate}
          onChange={(e) => setDegreeIssueDate(e.target.value)}
        ></input>
      </div>

      <div className="aTextInput">
        <small>Marks Obtained</small>
        <input
          className="aTextBox"
          type="text"
          value={marksObtained}
          onChange={(e) => setMarksObtained(e.target.value)}
          placeholder="Marks Obtained"
        ></input>
      </div>

      <div className="aTextInput">
        <small>Private Key File For Signing The Degree</small>
        <input
          className="aTextBox"
          type="file"
          accept=".pem"
          onChange={(e) => readFile(e)}
        />
      </div>

      <div className="aTextInput">
        <button
          className="aTextBox"
          onClick={() =>
            signAndSubmit({
              NameOnBlockChain: networkNameOfStudent,
              DateOfBirth: dateOfBirth,
              PlaceOfBirth: placeOfBirth,
              NameOfDegree: nameOfDegree,
              PlaceOfAttendance: placeOfAttendance,
              AttendedFrom: attendedFrom,
              AttendedTill: attendedTill,
              DegreeIssueDate: degreeIssueDate,
              MarksObtained: marksObtained,
            })
          }
        >
          <strong>Issue Degree on Network</strong>
        </button>
      </div>
      {serverResponseDiv}
    </div>
  );
}

export default IssueADegree;
