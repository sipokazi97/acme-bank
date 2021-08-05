import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core/styles";
import "w3-css/w3.css";
const axios = require("axios");
const SERVER_PORT = 8080;
const SERVER_ADDRESS = "http://3.16.161.15";

const useStyles = makeStyles((theme) => ({
  disabledButton: {
    background: "#f7f7f9",
  },
  heading: {
    color: "#c10132",
  },
}));

const Home = () => {
  const [accountsData, setAccountsData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get(`${SERVER_ADDRESS}:${SERVER_PORT}/`)
      .then((response) => {
        setAccountsData(response.data.enpointData.accounts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleWithdrawal = (index) => {
    var desiredWithdrawalAmount = prompt(
      "Please enter amount you want to withdraw",
      "0.00"
    );

    //converts to float and fix to 2 precision
    desiredWithdrawalAmount = parseFloat(
      parseFloat(desiredWithdrawalAmount).toFixed(2)
    );

    //check if enter balance
    if (desiredWithdrawalAmount != null) {
      //check input if correct
      if (
        !isNaN(desiredWithdrawalAmount) &&
        typeof desiredWithdrawalAmount == "number"
      ) {
        var tempAccountData = [...accountsData];

        //converts to float and fix to 2 precision
        tempAccountData[index].balance = parseFloat(
          tempAccountData[index].balance
        ).toFixed(2);

        if (
          tempAccountData[index].balance >= 0.0 &&
          tempAccountData[index].balance >= desiredWithdrawalAmount
        ) {
          tempAccountData[index].balance = proccessWithdrawal(
            tempAccountData[index].balance,
            desiredWithdrawalAmount
          );

          setAccountsData(tempAccountData);
          alert("Success");
        } else if (
          isCurrentAccount(tempAccountData[index]) &&
          tempAccountData[index].balance - desiredWithdrawalAmount >= -500.0
        ) {
          tempAccountData[index].balance = proccessWithdrawal(
            tempAccountData[index].balance,
            desiredWithdrawalAmount
          );

          setAccountsData(tempAccountData);
          alert("Success");
        } else {
          alert("Insufficient Balance for this account.");
        }
      } else {
        alert("Invalid input.");
      }
    } else {
      alert("Cancelled.");
    }
  };

  const proccessWithdrawal = (balance, desiredWithdrawalAmount) => {
    var balance = parseFloat(
      parseFloat(balance) - desiredWithdrawalAmount
    ).toFixed(2);
    return balance;
  };

  const isCurrentAccount = (account) => {
    return account.account_type == "cheque" && account.balance >= -500.0;
  };

  return (
    <div className="container w3-card">
      <h2 className={classes.heading}>Accounts List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Balance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {accountsData.map((account, index) => (
            <tr key={index}>
              <td> {account.account_number}</td>
              <td>{account.account_type}</td>
              <td> {account.balance}</td>
              <td>
                <div
                  className={`btn btn-md ${
                    account.balance >= 0.0 || isCurrentAccount(account)
                      ? "btn-success"
                      : classes.disabledButton
                  }`}
                  onClick={() =>
                    account.balance >= 0.0 || isCurrentAccount(account)
                      ? handleWithdrawal(index)
                      : ""
                  }
                >
                  Withdraw
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
