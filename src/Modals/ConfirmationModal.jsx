import React from "react";
import { generalSettings } from "../Setting";
import { animated, useSpring } from "@react-spring/web";
import { confirmationModalLabels } from "../Setting";
const ConfirmationModal = ({
  message,
  onCancel,
  onConfirm,
  transactionAmount,
  
}) => {
  

  const { title,withdrawConfirmMsg,taxLabel,receiveMsg,cancelButton,confirmButton} =confirmationModalLabels
 
  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const { withdrawTaxPercentage } = generalSettings;

  const taxAmount =
    (parseFloat(transactionAmount) * withdrawTaxPercentage) / 100;
  const amountAfterTax = parseFloat(transactionAmount) - taxAmount;
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <animated.div
        className="text-white mt-16 flex items-center justify-center rounded-lg shadow-lg max-w-lg w-full p-6 relative h-72 "
        style={{
          ...animation,
          background:
            "linear-gradient(180deg, rgba(4, 4, 16) 20%, rgba(12, 56, 85 ) 100%)",
          border: "solid 2px #045174",
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 text-lg text-white font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold my-3 mb-4">{title}</h2>
          {message === "Show WithDraw msg" ? (
            <div className="text-white text-center mb-4">
              {withdrawConfirmMsg} {transactionAmount}€?
              <br />
              <br />
              {taxLabel}:
              <span className="text-yellow-400 ml-2">
                {taxAmount.toFixed(2)}€
              </span>
              {" "}
              (<span className="text-orange-400">{withdrawTaxPercentage}%</span>
              )<br />
              {receiveMsg}:
              <span className="text-green-400 ml-2">
                {amountAfterTax.toFixed(2)}€
              </span>
            </div>
          ) : (
            <p className="text-center mb-4 my-3">{message}</p>
          )}
          <div className="flex justify-around  my-3 w-full">
            <button
              onClick={onCancel}
              className="text-sm  text-white p-3 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              style={{
                backgroundColor: "#080814",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
            >
              {cancelButton}
            </button>
            <button
              onClick={onConfirm}
              className="text-sm  text-white p-3 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              style={{
                backgroundColor: "#080814",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
            >
             {confirmButton}
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default ConfirmationModal;
