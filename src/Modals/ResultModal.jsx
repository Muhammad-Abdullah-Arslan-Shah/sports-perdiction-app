import React, { useContext } from "react";
import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle } from 'react-icons/ai';
import FootballContext from "../context/FootballContext";
import { animated, useSpring } from "@react-spring/web";
import { resultModalLabels } from "../Setting";

const ResultModal = ({currentBetSlip, closeModal, winMessages, loading, totalWinAmount}) => {
 
  const { loading: contextLoading, placedBets,
    setPlacedBets } = useContext(FootballContext);
  const { title, match, drawText, homeText, awayText, notFinishedMsg, errorMsg, yourBet ,lostMsg,totalWinMsg} = resultModalLabels;

  // EnsurecurrentBetSlip.results is always an array
  const results = Array.isArray(currentBetSlip.results) ?currentBetSlip.results : [];

  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const isLoading = loading || contextLoading; 

  const allBetsWon = results.length > 0 && results.every((result) => winMessages[result.matchLink]?.includes("won"));
  const anyMatchPending = results.some((result) =>result.homeScore === "" && result.awayScore === "");
  const anyMatchError = results.some((result) =>result.homeScore === undefined  && result.awayScore === undefined );
  const anyMatchLost = results.some((result) => winMessages[result.matchLink]?.includes("Failed"));

  let summaryMessage = "";
  let removeBet = false;
  if (allBetsWon) {
    summaryMessage = `${totalWinMsg} ${totalWinAmount.toFixed(2)}.`; 
    removeBet = true;
  } else if (anyMatchError) {
    summaryMessage = errorMsg;
    removeBet = false;
  }else if (anyMatchPending) {
    summaryMessage = notFinishedMsg;
    removeBet = false;
  } else if (anyMatchLost) {
    summaryMessage = lostMsg;
    removeBet = true;
  }
  // console.log(removeBet)
const removeBetSlip = () =>{
 
  if (removeBet)
    {
      const updatedPlacedBets = placedBets.filter(
        (bet) => bet.timestamp !== currentBetSlip.timestamp
      );
      
      setPlacedBets(updatedPlacedBets);
    }
    closeModal();
}
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-1001">
      <animated.div
        style={animation}
        className="bg-[#1d1d28] text-white text-shadow-lg p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-custom mt-10 relative">
        <button
          className="absolute top-2 right-2 text-white text-xl focus:outline-none"
          onClick={removeBetSlip}
        >
          <AiOutlineClose />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="loader-container-result">
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
          <>
            {results.length > 0 ? (
              results.map((result, index) => {
                const { betType,homeScore,awayScore, homeTeamName, awayTeamName, matchLink, error } = result;

                let matchStatusIcon = <AiOutlineClockCircle className="text-yellow-500 text-2xl absolute top-2 right-2" />;
                let statusMessage = notFinishedMsg;

                if (error || (homeScore === undefined && awayScore === undefined )) {
                  matchStatusIcon = <AiOutlineCloseCircle className="text-red-500 text-2xl absolute top-2 right-2" />;
                  statusMessage = errorMsg;
                } else if (homeScore === "" && awayScore === "" ) {
                  matchStatusIcon = <AiOutlineClockCircle className="text-yellow-500 text-2xl absolute top-2 right-2" />;
                } else if (winMessages[matchLink]?.includes("won")) {
                  matchStatusIcon = <AiOutlineCheckCircle className="text-green-500 text-2xl absolute top-2 right-2" />;
                  statusMessage = winMessages[matchLink];
                } else {
                  matchStatusIcon = <AiOutlineCloseCircle className="text-red-500 text-2xl absolute top-2 right-2" />;
                  statusMessage = winMessages[matchLink];
                }

               
                

                return (
                  <div key={index} className="mb-4 p-4 rounded-lg relative" style={{ background: "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)", border: "solid 2px #045174" }}>
                    {matchStatusIcon}
                    <p className="mb-2 text-center"><strong>{match} {index + 1}</strong></p>
                    {/* if the result is pending or error then show only match name bet type and msg otherwise show home away result */}
                    {statusMessage === notFinishedMsg || statusMessage === errorMsg ? (
                      <>
                        <p className="mb-2 text-center">{homeTeamName} - {awayTeamName}</p>
                        <p className="mb-2 text-center">{yourBet} ({betType === "home" ? (
                          <span>{homeText}</span>
                        ) : betType === "away" ? (
                          <span>{awayText}</span>
                        ) : (
                          <span>{drawText}</span>
                        )})</p>
                      
                      </>
                    ) : (
                      <>
                        <p className="mb-2 text-center">{homeTeamName} - {awayTeamName} ({homeScore} - {awayScore})</p>
                        <p className="mb-2 text-center">{yourBet} ({betType === "home" ? (
                          <span>{homeText}</span>
                        ) : betType === "away" ? (
                          <span>{awayText}</span>
                        ) : (
                          <span>{drawText}</span>
                        )})</p>
                        
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center">
                <div className="loader-container-result">
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
            )}
            {summaryMessage && (
              <div className={`mt-4 p-4 rounded-lg ${allBetsWon ? 'text-green-700' : anyMatchPending ? 'text-yellow-400' : 'text-red-700'}`}>
                <p className=" text-center">{summaryMessage}</p>
              </div>
            )}
          </>
        )}
      </animated.div>
    </div>
  );
};

export default ResultModal;
