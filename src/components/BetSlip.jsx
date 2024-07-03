import React, { useContext, useState, useEffect } from "react";
import FootballContext from "../context/FootballContext";
import ConfirmationModal from "../Modals/ConfirmationModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import { generalSettings, betSlipLabels, navLabels } from "../Setting";
import fingercrossed from "../assets/fingercrossed.svg";


const BetSlip = () => {
  const { maxMoneyToPlaceBet, maxBets } = generalSettings;
  const {
    betSlipTitle,
    initialUpMsg,
    initialDownMsg,
    confirmMsg,
    homeButton,
    awayButton,
    drawButton,
    amountErrorMsg,
    lowBalanceMsg,
    maxMoneyMsg,
    potentialEarnings,
    placeBetButton,
    placeholder,
    successMsg,
    freeBalanceLabel,
    matchStartErrorMsg,
    maxBetsMsg,
  } = betSlipLabels;
  const {
    betSlip,
    setBetSlip,
    placeBets,
    balance,
    setBalance,
    freeBalance,
    setFreeBalance,
    placedBets,
  } = useContext(FootballContext);
  const [totalBetAmount, setTotalBetAmount] = useState("");
  const [useFreeBalance, setUseFreeBalance] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [removingBetIndex, setRemovingBetIndex] = useState(null); // New state to track which bet is being removed
  const [numberOfGroups, setNumberOfGroups] = useState(0);

  // Define the function to group bets by timestamp
  const getNumberOfGroupsByTimestamp = (bets) => {
    if (bets !== undefined){
    const uniqueTimestamps = new Set(bets.map(bet => bet.timestamp));
    return uniqueTimestamps.size;
    }
    return 0;
  };

  // Use useEffect to call the function whenever placedBets changes
  useEffect(() => {
    const numberOfGroups = getNumberOfGroupsByTimestamp(placedBets);
    setNumberOfGroups(numberOfGroups);
  }, [placedBets]);

  const handleRemoveBet = (index) => {
    setRemovingBetIndex(index);
    setTimeout(() => {
      const newBetSlip = betSlip.filter((_, i) => i !== index);
      setBetSlip(newBetSlip);
      setRemovingBetIndex(null); // Reset the removing bet index after removal
    }, 500); // Match the duration of the fadeOutMoveDown animation
  };

  const handlePlaceBet = () => {
    setShowConfirmationModal(true);
    setModalMessage(confirmMsg);
  };

  const confirmPlaceBet = () => {
  
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const totalAmount = parseFloat(totalBetAmount);
    setShowConfirmationModal(false);

    if ( numberOfGroups+1 > maxBets) {
      setModalMessage(`${maxBetsMsg} ${maxBets}`);
      setShowErrorModal(true);
      return;
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      setModalMessage(amountErrorMsg);
      setShowErrorModal(true);
      return;
    }

    if (useFreeBalance) {
      if (totalAmount > freeBalance) {
        setModalMessage(lowBalanceMsg);
        setShowErrorModal(true);
        return;
      }

      if (totalAmount > maxMoneyToPlaceBet) {
        setModalMessage(`${maxMoneyMsg} ${maxMoneyToPlaceBet}€`);
        setShowErrorModal(true);
        return;
      }

      setFreeBalance(freeBalance - totalAmount);
    } else {
      if (totalAmount > balance) {
        setModalMessage(lowBalanceMsg);
        setShowErrorModal(true);
        return;
      }

      if (totalAmount > maxMoneyToPlaceBet) {
        setModalMessage(`${maxMoneyMsg} ${maxMoneyToPlaceBet}€`);
        setShowErrorModal(true);
        return;
      }

      setBalance(balance - totalAmount);
    }

    const bets = betSlip.map((bet) => ({
      match: {
        timeStamp: bet.startDateTimestamp,
        homeTeamLogo: bet.homeTeamLogo,
        awayTeamLogo: bet.awayTeamLogo,
        homeTeamName: bet.homeTeamName,
        awayTeamName: bet.awayTeamName,
        selectedOdd: bet.selectedOdd,
        betType: bet.betType,
        Link: bet.href,
      },
      amount: totalAmount,
    }));

    

    // Check if the current time is less than the start date of all matches
    const allMatchesValid = bets.every(bet => currentTimestamp < bet.match.timeStamp);

    if (allMatchesValid) {
      placeBets(bets);
      // console.log("placed bets:",placedBets)
      setBetSlip([]);
      setTotalBetAmount("");
      setModalMessage(successMsg);
      setShowSuccessModal(true);
    } else {
      setModalMessage(matchStartErrorMsg); // Set appropriate error message
      setShowErrorModal(true);
    }
  };

  const totalOdds = betSlip.reduce((acc, bet) => acc * bet.selectedOdd, 1);

  return (
    <>
      <div className="bet-slip p-3 rounded-lg flex flex-col h-full overflow-y-auto scrollbar-custom">
        <div className="upper flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            {betSlipTitle}
          </h2>
          {betSlip.map((bet, index) => (
            <div
              key={index}
              className={`bet-card relative w-full mb-6 p-4 border border-gray-200 rounded-lg shadow-md bg-gray-50 ${
                removingBetIndex === index ? "remove-bet-card" : ""
              }`}
              style={{
                background:
                  "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)",
                border: "solid 2px #045174",
              }}
            >
              <button
                onClick={() => handleRemoveBet(index)}
                className="absolute top-0 right-0 mt-2 mr-2 text-white text-lg font-bold"
              >
                &times;
              </button>

              <p className="text-lg font-medium mb-2 text-white">
                {bet.homeTeamName} - {bet.awayTeamName}
              </p>
              <div className="font-bold text-white flex justify-between">
                {bet.betType === "home" ? (
                  <span>{homeButton}</span>
                ) : bet.betType === "away" ? (
                  <span>{awayButton}</span>
                ) : (
                  <span>{drawButton}</span>
                )}
                <span> {bet.selectedOdd} </span>
              </div>
            </div>
          ))}
        </div>

        <div className="middle flex flex-col items-center justify-center flex-grow text-center text-white mb-36">
          {betSlip.length === 0 && (
            <>
              <img
                src={fingercrossed}
                alt="fingerCross picture"
                className="h-20 w-20 mb-4"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{initialUpMsg}</h2>
                <p className="text-sm font-thin">{initialDownMsg}</p>
              </div>
            </>
          )}
        </div>

        {betSlip.length !== 0 && (
          // <div className={`bottom bet-control w-full ${!useFreeBalance? "border-t":""} p-4 shadow-md mb-20`}>
          <div className="bottom bet-control w-full p-4 shadow-md mb-20 border-t">
            <div className="flex items-center mb-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useFreeBalance}
                  onChange={() => setUseFreeBalance(!useFreeBalance)}
                  className="sr-only peer "
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer

                 dark:bg-gray-700 peer-checked:after:translate-x-full 
                 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                 after:border-0 after:border-0 peer-hover:after:border-0 peer-focus:after:border-0 peer-checked:bg-[#05b5f0] peer-checked:after:border">
                </div>
                <div className="flex items-center text-white">
                  <span className="ml-3">{freeBalanceLabel}</span>
                  <img
                    src={navLabels.freebetLogo}
                    alt="Free bet Logo"
                    className="w-7 h-6 mx-2 rounded-full shadow-md"
                  />
                  {/* <span>(€{freeBalance.toFixed(2)})</span> */}
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between my-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                value={totalBetAmount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Check if the input is a valid positive number
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    // If it's a valid positive number, update the state
                    setTotalBetAmount(inputValue);
                  } else if (inputValue === "" || /^\d+$/.test(inputValue)) {
                    // If the input is empty or consists only of digits, allow it
                    setTotalBetAmount(inputValue);
                  }
                  // If the input is neither a valid positive number nor empty/digits only, ignore it
                }}
                className="w-1/2 h-10 mr-2 rounded-lg text-white bg-[#080814] px-3"
                placeholder={placeholder}
                style={{ border: "2px solid #2d3234" }}
              />
              <div className="total-odds p-2 bg-yellow-300 rounded-lg text-center">
                <p className="text-lg font-semibold">{totalOdds.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between my-1">
              <p className="text-white text-s">{potentialEarnings}:</p>
              <p className="font-semibold text-white text-s">
                {isNaN(totalBetAmount) || totalBetAmount === ""
                  ? "0.00"
                  : (totalBetAmount * totalOdds).toFixed(2)}
                €
              </p>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={betSlip.length === 0}
              className="text-sm w-full mt-4 text-white p-3 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              style={{
                backgroundColor: "#0e2a40",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
            >
              {placeBetButton} {totalBetAmount ? `${totalBetAmount}€` : "0.00€"}
            </button>
          </div>
        )}
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          message={modalMessage}
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={confirmPlaceBet}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message={modalMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          message={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default BetSlip;
