import React, { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { PromoModalLabels } from "../Setting";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const PromoModal = ({ toggleModal, setFreeBalance }) => {
  const {
    title,
    placeholder,
    cancelButton,
    confirmButton,
    balanceAddedonOnSuccess,
    successMsg1,
    successMsg2,
    errorMsg,
    promotionalCode,
  } = PromoModalLabels;

  const [promoCode, setPromoCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const handlePromoCodeConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (promoCode === promotionalCode) {
        setFreeBalance((prevFreeBalance) => prevFreeBalance + parseFloat(balanceAddedonOnSuccess));
        setModalMessage("show promo msg");
        setShowSuccessModal(true);
      } else {
        setModalMessage(errorMsg);
        setShowErrorModal(true);
      }
    }, 1000);
  };

  return (
    <>
      <animated.div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50" style={animation}>
        <div
          className="text-white mt-16 flex items-center justify-center rounded-lg shadow-lg max-w-lg w-full p-6 relative h-72"
          style={{
            background:
              "linear-gradient(180deg, rgba(4, 4, 16) 20%, rgba(12, 56, 85) 100%)",
            border: "solid 2px #045174",
          }}
        >
          <button
            onClick={toggleModal}
            className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 text-lg text-white font-bold"
          >
            &times;
          </button>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="loader-container-promo">
                <div className="loader">
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                  <div className="bar4"></div>
                  <div className="bar5"></div>
                  <div className="bar6"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full h-full">
              <h2 className="text-2xl font-bold mb-8">{title}</h2>
              <input
                type="text"
                className="mr-2 px-6 py-2 my-3 rounded-lg text-white bg-[#080814]"
                placeholder={placeholder}
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                }}
                style={{ border: "2px solid #2d3234" }}
              />
              <div className="flex justify-center my-3 w-full">
                <button
                  onClick={toggleModal}
                  className="text-sm text-white p-3 mx-8 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                  style={{
                    backgroundColor: "#080814",
                    opacity: "0.8",
                    boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                  }}
                >
                  {cancelButton}
                </button>
                <button
                  onClick={handlePromoCodeConfirm}
                  className="text-sm text-white p-3 mx-8 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
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
          )}
        </div>
        {showSuccessModal && (
          <SuccessModal
            message={modalMessage}
            onClose={() => setShowSuccessModal(false)}
            successMsg1={successMsg1}
            successMsg2={successMsg2}
            balanceAddedonOnSuccess={balanceAddedonOnSuccess}
          />
        )}
        {showErrorModal && (
          <ErrorModal
            message={modalMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </animated.div>
    </>
  );
};

export default PromoModal;
