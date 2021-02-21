const axios = require("axios").default;

const submitTransactionToBlockChain = async (
  transactionName,
  argumentsCSVString,
  onServerResponseReceived
) => {
  console.log("going to post the following 1 : ", transactionName);
  console.log("going to post the following 2 : ", argumentsCSVString);

  axios
    .post("http://localhost:3001/submitTransactionToBlockChain", {
      nameOfTransaction: transactionName,
      argsToBePassed: argumentsCSVString,
    })
    .then(
      (response) => {
        console.log(response.data);
        onServerResponseReceived(response.data, response.status);
      },
      (error) => {
        console.log("encountered error");
        console.log(error.response.status);
        console.log(error.response.data);
        onServerResponseReceived(null, error.response.status);
      }
    );
};

export default submitTransactionToBlockChain;
