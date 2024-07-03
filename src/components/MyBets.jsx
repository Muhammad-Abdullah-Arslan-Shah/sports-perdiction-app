import React, { useContext, useState, useEffect, useRef } from "react";
import FootballContext from "../context/FootballContext";
import { FaArrowUp } from "react-icons/fa";
import Modal from "../Modals/ResultModal";
import { myBetsLabels } from "../Setting";
const MyBets = () => {
  const {
    myBetTitle,
    sortBy,
    sortLatest,
    sortOldest,
    betButton,
    dateLabel,
    amountBet,
    Odds,
    homeButton,
    awayButton,
    drawButton,
    potentialEarning,
    checkButton,
    NoBetsMsg,
  } = myBetsLabels;

  const {
    placedBets,
    fetchMatchResult,
    loading,
    setBalance,
    sports,
    selectedSport,
  } = useContext(FootballContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBetSlip, setCurrentBetSlip] = useState(null);
  const [winMessages, setWinMessages] = useState({});
  const [balanceUpdatedBets, setBalanceUpdatedBets] = useState({});
  const [showBetList, setShowBetList] = useState({});
  const [sortOrder, setSortOrder] = useState("latest");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [fullWinAmount, setFullWinAmount] = useState(0);
  const [finalHomeResults, setFinalHomeResults] = useState(0);
  const [finalAwayResults, setFinalAwayResults] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current.scrollTop > 20) {
      setShowScrollUp(true);
    } else {
      setShowScrollUp(false);
    }
  };

  const scrollToTop = () => {
    containerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatDate = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  const handleCheckResults = async (betSlip) => {
    setCurrentBetSlip(betSlip);
    setIsModalOpen(true);

    console.log("Bet Id:", betSlip.id);

    try {
      const results = await Promise.all(
        betSlip.matches.map(async (match) => {
          try {
            const result = await fetchMatchResult(match.match.Link);
            return {
              ...result,
              homeTeamName: match.match.homeTeamName,
              awayTeamName: match.match.awayTeamName,
              betType: match.match.betType,
              matchLink: match.match.Link,
            };
          } catch (error) {
            console.error(
              "Error fetching result for match:",
              match.match.Link,
              error
            );
            return { error: true };
          }
        })
      );

      const filteredResults = results.filter((result) => result !== null);

      setCurrentBetSlip((prev) => ({ ...prev, results: filteredResults }));
    } catch (error) {
      console.error("Error fetching match results:", error);
    }
  };

  const toggleBetList = (index) => {
    setShowBetList((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    if (!currentBetSlip || !currentBetSlip.results || !currentBetSlip.matches) {
      return;
    }

    let newWinMessages = { ...winMessages };
    let totalWinAmount = 0;
    let allMatchesWon = true;
    const totalOdds = currentBetSlip.matches.reduce(
      (acc, bet) => acc * bet.match.selectedOdd,
      1
    );
    const income = currentBetSlip.amount * totalOdds;
    totalWinAmount = income;

    const matchResults = currentBetSlip.results.map((result, index) => {
      const match = currentBetSlip.matches[index];
      const { homeScore, awayScore } = result;

      const betType = match.match.betType;
      const won =
        (betType === "home" && homeScore > awayScore) ||
        (betType === "away" && awayScore > homeScore) ||
        (betType === "draw" && homeScore === awayScore);

      if (homeScore === undefined || awayScore === undefined) {
        newWinMessages[match.match.Link] = "Pending";
        allMatchesWon = false;
      } else if (won) {
        newWinMessages[match.match.Link] = "You won the bet.";
      } else {
        newWinMessages[match.match.Link] = "Failed.";
        allMatchesWon = false;
      }

      return result;
    });

    if (
      JSON.stringify(currentBetSlip.results) !== JSON.stringify(matchResults)
    ) {
      setCurrentBetSlip((prev) => ({
        ...prev,
        results: matchResults,
      }));
    }

    if (allMatchesWon && !balanceUpdatedBets[currentBetSlip.timestamp]) {
      setFullWinAmount(totalWinAmount);
      setBalance((prevBalance) => prevBalance + totalWinAmount);
      setBalanceUpdatedBets((prevBalanceUpdatedBets) => ({
        ...prevBalanceUpdatedBets,
        [currentBetSlip.timestamp]: true,
      }));
    }

    if (JSON.stringify(winMessages) !== JSON.stringify(newWinMessages)) {
      setWinMessages(newWinMessages);
    }
  }, [
    currentBetSlip,
    winMessages,
    selectedSport,
    sports,
    setBalance,
    balanceUpdatedBets,
    setBalanceUpdatedBets,
    setCurrentBetSlip,
    setWinMessages,
  ]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBetSlip(null);
    setWinMessages({});
  };

  const groupedBets = placedBets.reduce((acc, bet) => {
    const betSlip = acc.find((item) => item.timestamp === bet.timestamp);
    if (betSlip) {
      betSlip.matches.push(bet);
    } else {
      acc.push({
        id: new Date(bet.timestamp).getTime(), // Convert timestamp to numeric Unix epoch time
        timestamp: bet.timestamp,
        matches: [bet],
        amount: bet.amount,
      });
    }
    return acc;
  }, []);
  

  const sortedBets = [...groupedBets].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);

    if (sortOrder === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  return (
    <>
      {sortedBets.length === 0 ? (
        <>
          <h2 className="text-3xl font-bold text-center text-white mt-8">
            {myBetTitle}
          </h2>
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl font-semibold text-white mb-28">
              {NoBetsMsg}
            </p>
          </div>
        </>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="p-4 scrollbar-custom overflow-y-auto pb-20 h-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-center text-white">
              {myBetTitle}
            </h2>
            <button
              className="bg-[#0e2a40] hover:bg-slate-700 text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-700 rounded transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              onClick={toggleSortOrder}
            >
              {sortBy}{" "}
              {sortOrder === "latest" ? `${sortOldest}` : `${sortLatest}`}
            </button>
          </div>
          {sortedBets.map((betSlip, index) => {
            const totalOdds = betSlip.matches.reduce(
              (acc, bet) => acc * bet.match.selectedOdd,
              1
            );

            const amount = betSlip.amount;

            const isExpanded = showBetList[index];
            return (
              <div
                key={index}
                className="mb-6 p-8 rounded-lg shadow-md bg-white"
                style={{
                  position: "relative",
                  background: "rgba(12, 56, 85, 0.8)",
                  border: "solid 2px #045174",
                }}
              >
                <button
                  className="block mx-auto text-lg font-semibold text-white mb-4"
                  onClick={() => toggleBetList(index)}
                >
                  {betButton}{" "}
                  <span className="text-red-500">
                    ({betSlip.matches.length})
                  </span>
                  <p className="text-gray-500 text-sm text-white">
                    {dateLabel}: {formatDate(betSlip.timestamp)}
                  </p>
                </button>
                <div className={`myslip ${isExpanded ? "expanded" : "shrink"}`}>
                  {isExpanded && (
                    <div>
                      {betSlip.matches.map((bet, matchIndex) => (
                        <div
                          key={matchIndex}
                          className="shadow-md rounded-lg overflow-hidden transform mb-2 transition-transform duration-300 p-2"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)",
                            border: "solid 2px #045174",
                          }}
                        >
                          <div className="grid grid-cols-3 items-center justify-items-center mb-2 gap-4">
                            <div className="flex items-center text-white">
                              <img
                                src={bet.match.homeTeamLogo}
                                alt={bet.match.homeTeamName}
                                className="w-16 h-16 object-contain mr-2"
                              />
                              <p
                                className="text-xl font-semibold"
                                style={{
                                  whiteSpace: "wrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {bet.match.homeTeamName}
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center text-white">
                              <p className="text-xl font-bold mb-2">vs</p>
                              <div
                                className="font-bold rounded text-white p-2 text-center"
                                style={{
                                  backgroundColor: "#080814",
                                  opacity: "0.8",
                                  boxShadow:
                                    "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                                }}
                              >
                                <p className="font-bold">
                                  {bet.match.betType === "home" ? (
                                    <span>{homeButton}</span>
                                  ) : bet.match.betType === "away" ? (
                                    <span>{awayButton}</span>
                                  ) : (
                                    <span>{drawButton}</span>
                                  )}
                                </p>
                                <p>{bet.match.selectedOdd}</p>
                              </div>
                            </div>
                            <div className="flex items-center text-white">
                              <p
                                className="text-xl font-semibold mr-2"
                                style={{
                                  whiteSpace: "wrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {bet.match.awayTeamName}
                              </p>
                              <img
                                src={bet.match.awayTeamLogo}
                                alt={bet.match.awayTeamName}
                                className="w-16 h-16 object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        className="my-4 text-center text-white grid gap-4"
                        style={{
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        }}
                      >
                        <p className="text-lg font-bold">
                          {amountBet}: {amount}€{" "}
                        </p>
                        <p className="text-lg font-bold">
                          {Odds}: {totalOdds.toFixed(2)}
                        </p>
                        <p className="text-lg font-bold">
                          {potentialEarning}: {(amount * totalOdds).toFixed(2)}€
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="text-sm text-white p-3 mb-4 rounded hover:bg-gray-700 hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                          style={{
                            backgroundColor: "#0e2a40",
                            opacity: "0.8",
                            boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                          }}
                          onClick={() => handleCheckResults(betSlip)}
                        >
                          {checkButton}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {showScrollUp && !isModalOpen && (
            <button
              className="rounded-full p-2 shadow-md bg-blue-800 hover:bg-slate-800"
              onClick={scrollToTop}
              style={{
                position: "absolute",
                bottom: "9%",
                right: "48.5%",
                zIndex: "50",
                backgroundColor: "#080814",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
            >
              <FaArrowUp color="white" size={15} />
            </button>
          )}
        </div>
      )}
      <div style={{ height: "40px", overflow: "auto" }}>
        {isModalOpen && (
          <Modal
            currentBetSlip={currentBetSlip}
            closeModal={closeModal}
            winMessages={winMessages}
            loading={loading}
            totalWinAmount={fullWinAmount}
            finalHomeResults={finalHomeResults}
            finalAwayResults={finalAwayResults}
          />
        )}
      </div>
    </>
  );
};

export default MyBets;
