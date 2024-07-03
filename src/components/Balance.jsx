import React, { useContext, useState } from "react";
import FootballContext from "../context/FootballContext";
import ConfirmationModal from "../Modals/ConfirmationModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import { generalSettings, balanceModalLabels } from "../Setting";
import { animated, useTransition } from "@react-spring/web";

const Balance = ({ toggleModal }) => {
  
  const {
    title,
    currentBalance,
    depositButton,
    withdrawButton,
    depositConfirm,
    lowBalanceMsg,
    depositSuccessMsg,
    WithdrawSuccessMsg,
     placeholder,
  } = balanceModalLabels;

  const { withdrawTaxPercentage } = generalSettings;
  const { balance, setBalance } = useContext(FootballContext);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const taxAmount = (parseFloat(transactionAmount) *parseFloat( withdrawTaxPercentage)) / 100;
const amountAfterTax = parseFloat(parseFloat(transactionAmount) - taxAmount);

  const handleDeposit = () => {
    if (transactionAmount) {
      setConfirmationMessage(`${depositConfirm} ${transactionAmount}€?`);
      setTransactionType("deposit");
      setShowConfirmation(true);
    }
  };

  const handleWithdrawal = () => {
    if (transactionAmount && parseFloat(transactionAmount) <= balance) {
      const taxAmount =
        (parseFloat(transactionAmount) * withdrawTaxPercentage) / 100;
     
      setConfirmationMessage("Show WithDraw msg");
      setTransactionType("withdrawal");
      setShowConfirmation(true);
    } else if (transactionAmount && parseFloat(transactionAmount) > balance) {
      setConfirmationMessage(`${lowBalanceMsg} ${transactionAmount}€`);
      setShowError(true);
    }
  };

  const confirmTransaction = () => {
    if (transactionType === "deposit") {
      setBalance((prevBalance) => prevBalance + parseFloat(transactionAmount));
      setConfirmationMessage(`${depositSuccessMsg} ${transactionAmount}€`);
      setShowSuccess(true);
    } else if (transactionType === "withdrawal") {
      setBalance((prevBalance) => prevBalance - parseFloat(transactionAmount));
      setConfirmationMessage(`${WithdrawSuccessMsg} ${amountAfterTax}€`);
      setShowSuccess(true);
    }
    setShowConfirmation(false);
    setTransactionAmount("");
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => toggleModal(), 500); // Delay to allow animation to complete
  };

  const transitions = useTransition(isVisible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <>
      {transitions((style, item) =>
        item ? (
          <animated.div
            className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
            style={style}
          >
            <div
              className="max-w-lg mt-16 mx-auto p-1 pt-3 bg-white rounded-lg shadow-lg relative w-full h-72"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4, 4, 16) 20%, rgba(12, 56, 85) 100%)",
                border: "solid 2px #045174",
              }}
            >
              <button
                onClick={handleClose}
                className="absolute top-0 right-0 mt-2 mr-2 text-white text-lg font-bold"
              >
                &times;
              </button>
              <div className="flex justify-center">
                <h2 className="text-2xl text-white font-bold mb-8">{title}</h2>
              </div>
              <div className="flex items-center justify-center text-lg mb-8">
                <span className="mr-3 font-bold text-white">
                  {currentBalance}:
                </span>
                <span className="font-bold text-green-500">
                  {balance.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-center mb-4">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        className="mr-2 px-6 py-2 rounded-lg text-white bg-[#080814]"
        placeholder={placeholder}
        value={transactionAmount}
        onChange={(e) => {
          const inputValue = e.target.value;
          // Check if the input is a valid positive number
          if (/^\d*\.?\d*$/.test(inputValue)) {
            // If it's a valid positive number, update the state
            setTransactionAmount(inputValue);
          } else if (inputValue === "" || /^\d+$/.test(inputValue)) {
            // If the input is empty or consists only of digits, allow it
            setTransactionAmount(inputValue);
          }
          // If the input is neither a valid positive number nor empty/digits only, ignore it
        }}
        style={{ border: "2px solid #2d3234" }}
      />
    </div>
              <div className="flex justify-center my-8 mb-2">
                <button
                  className="text-sm mx-4 text-white p-3 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                  style={{
                    backgroundColor: "#080814",
                    opacity: "0.8",
                    boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                  }}
                  onClick={handleDeposit}
                >
                  {depositButton}
                </button>
                <button
                  className="text-sm mx-4 text-white p-3 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                  style={{
                    backgroundColor: "#080814",
                    opacity: "0.8",
                    boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                  }}
                  onClick={handleWithdrawal}
                >
                  {withdrawButton}
                </button>
              </div>

              {showConfirmation && (
                <ConfirmationModal
                  message={confirmationMessage}
                  onCancel={() => setShowConfirmation(false)}
                  transactionAmount={transactionAmount}
                  onConfirm={confirmTransaction}
                />
              )}
              {showSuccess && (
                <SuccessModal
                  message={confirmationMessage}
                  onClose={() => setShowSuccess(false)}
                />
              )}
              {showError && (
                <ErrorModal
                  message={confirmationMessage}
                  onClose={() => setShowError(false)}
                />
              )}
            </div>
          </animated.div>
        ) : null
      )}
    </>
  );
};

export default Balance;
