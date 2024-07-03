import React, { useContext, useState } from "react";
import FootballContext from "../context/FootballContext";
import ProcessNav from "./ProcessNav";
import { generalSettings, matchLabels } from "../Setting";
import ErrorModal from "../Modals/ErrorModal";
import { useSpring, animated } from "@react-spring/web";

const MatchItem = () => {
  const { matches, betSlip, addToBetSlip } = useContext(FootballContext);
  const { maxMatches } = generalSettings;
  const {
    matchTitle,
    noContentMsg,
    homeButton,
    awayButton,
    drawButton,
    maxMatchesError1,
    maxMatchesError2,
    placedBetMsg,
  } = matchLabels;

  const animation = useSpring({
    to: { opacity: 1, scale: "scale(1)" },
    from: { opacity: 0, scale: "scale(0.5)" },
    config: { duration: 800 },
  });
  const [errorMsg, setErrorMsg] = useState("");

  if (matches.length === 0) {
    return (
      <div className="flex justify-center items-center text-white mt-10">
        {noContentMsg}
      </div>
    );
  }

  // Get the current timestamp
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Filter and sort matches by startDateTimestamp
  const filteredAndSortedMatches = matches
    .filter((match) => parseInt(match.startDateTimestamp) > currentTimestamp)
    .sort((a, b) => parseInt(a.startDateTimestamp) - parseInt(b.startDateTimestamp));

  // Function to format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddToBetSlip = (match, odd, betType) => {
    if (betSlip.length >= maxMatches) {
      setErrorMsg(`${maxMatchesError1} ${maxMatches}  ${maxMatchesError2}`);
    } else {
      addToBetSlip(match, odd, betType);
    }
  };

  const closeModal = () => {
    setErrorMsg("");
  };

  return (
    <>
      <ProcessNav />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">{matchTitle}</h1>
        <animated.div style={animation}>
          {filteredAndSortedMatches.length === 0 ? (
            <div className="flex justify-center items-center text-white mt-10">
              {noContentMsg}
            </div>
          ) : (
            filteredAndSortedMatches.map((match, index) =>
              match.homeTeamName &&
              match.awayTeamName &&
              match.odds &&
              match.odds.length >= 2 &&
              match.odds.length <= 3 &&
              match.odds.every((odd) => odd != null) ? (
                <div
                  key={index}
                  className="shadow-md rounded-lg overflow-hidden transform hover:scale-[1.02]  transition-transform duration-300 my-3 p-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)",
                    border: "solid 2px #045174",
                  }}
                >
                  <div className="text-center mb-4">
                    <span className="text-gray-200">
                      {formatDate(match.startDateTimestamp)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center mb-2 gap-4">
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center">
                        <img
                          src={match.homeTeamLogo}
                          alt={match.homeTeamName}
                          className="w-16 h-16 object-contain mx-3  "
                        />
                        <div
                          className="text-lg font-semibold text-white"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {match.homeTeamName}
                        </div>
                      </div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="text-lg font-bold text-white">vs</div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center">
                        <div
                          className="text-lg font-semibold text-white mr-2"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {match.awayTeamName}
                        </div>
                        <img
                          src={match.awayTeamLogo}
                          alt={match.awayTeamName}
                          className="w-16 h-16 object-contain mx-3 "
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 space-x-4">
                    {betSlip.some((bet) => bet.href === match.href) ? (
                      <div className="text-white m-4">
                        {placedBetMsg}{" "}
                        {betSlip.find((bet) => bet.href === match.href)
                          .betType === "home"
                          ? match.homeTeamName
                          : betSlip.find((bet) => bet.href === match.href)
                              .betType === "away"
                          ? match.awayTeamName
                          : "Draw"}
                      </div>
                    ) : (
                      <>
                        <button
                          className="text-sm text-white p-2 rounded hover:bg-white hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                          onClick={() =>
                            handleAddToBetSlip(match, match.odds[0], "home")
                          }
                          style={{
                            backgroundColor: "#080814",
                            opacity: "0.8",
                            boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                          }}
                        >
                          <p>{homeButton}</p>
                          {match.odds[0]}
                        </button>
                        {match.odds.length === 3 && (
                          <button
                            className="text-sm text-white p-2 rounded hover:bg-white hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                            onClick={() =>
                              handleAddToBetSlip(match, match.odds[1], "draw")
                            }
                            style={{
                              backgroundColor: "#080814",
                              opacity: "0.8",
                              boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                            }}
                          >
                            <p>{drawButton}</p>
                            {match.odds[1]}
                          </button>
                        )}
                        <button
                          className="text-sm text-white p-2 rounded hover:bg-white hover:text-gray-400 transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
                          onClick={() =>
                            handleAddToBetSlip(
                              match,
                              match.odds[match.odds.length - 1],
                              "away"
                            )
                          }
                          style={{
                            backgroundColor: "#080814",
                            opacity: "0.8",
                            boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
                          }}
                        >
                          <p>{awayButton}</p>
                          {match.odds[match.odds.length - 1]}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : null
            )
          )}
        </animated.div>
      </div>

      {errorMsg && <ErrorModal message={errorMsg} onClose={closeModal} />}
    </>
  );
};

export default MatchItem;
