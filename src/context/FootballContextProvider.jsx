import React, { useState, useEffect } from "react";
import FootballContext from "./FootballContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FootballContextProvider = ({ children }) => {
  const [sports, setSports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [betSlip, setBetSlip] = useState([]);
  const [placedBets, setPlacedBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedLeagueLable, setSelectedLeagueLable] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [freeBalance, setFreeBalance] = useState(1000);
  const [FetchSport, setFetchSport] = useState(false);
  const navigateTo = useNavigate();

  const handleSportSelect = (sportName) => {
    setSelectedSport(sportName);
    setSelectedCountry("");
    setSelectedLeague("");
    navigateTo("/countries");
    fetchCountries(sportName);
  };

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setSelectedLeague("");
    navigateTo("/leagues");
  };

  const handleLeagueSelect = (leaguePath, leagueLabel) => {
    setSelectedLeagueLable(leagueLabel);
    setSelectedLeague(leaguePath);
    navigateTo("/matches");s
    fetchMatches(leaguePath);
  };

  useEffect(() => {
    if (FetchSport) {
      setLoading(true);
      axios
        .get("https://backend-beryl-seven-78.vercel.app/api/scrapeSports")
        .then((response) => {
          setSports(response.data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [FetchSport]);

  const fetchCountries = (sport) => {
    setLoading(true);
    axios
      .get(`https://backend-beryl-seven-78.vercel.app/api/scrapeCountries?sport=${sport}`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMatches = (leaguePath) => {
    const leagueUrl = `httpss://www.oddsportal.com${leaguePath}`;
    setLoading(true);
    axios
      .get(`https://backend-beryl-seven-78.vercel.app/api/scrapeMatches?league=${leagueUrl}`)
      .then((response) => {
        setMatches(
          response.data.map((match) => ({
            ...match,
            selectedOdd: match.odds[0],
          }))
        );
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMatchResult = async (matchLink) => {
    try {
      const response = await axios.get(
        `https://backend-beryl-seven-78.vercel.app/api/scrapeMatchResult?match=${matchLink}`
      );
      const { homeScore, awayScore } = response.data;
      const resultData = {
        homeScore,
        awayScore,
      };
      console.log("Match Results:",resultData);
      return resultData;
    } catch (error) {
      console.error("Error fetching match result:", error);
      throw error;
    }
  };
  
  const addToBetSlip = (match, odd, betType) => {
    // Check if the match is already in the bet slip
    const existingBetIndex = betSlip.findIndex(
      (bet) => bet.href === match.href
    );

    if (existingBetIndex === -1) {
      // If the match is not in the bet slip, add it
      const newBet = { ...match, selectedOdd: odd, betType, amount: 0 };
      setBetSlip([...betSlip, newBet]);
    } else {
      // If the match is already in the bet slip, update the existing bet
      const updatedBetSlip = [...betSlip];
      updatedBetSlip[existingBetIndex] = {
        ...updatedBetSlip[existingBetIndex],
        selectedOdd: odd,
        betType,
      };
      setBetSlip(updatedBetSlip);
    }
  };

  const placeBets = (bets) => {
    const betsWithTimestamps = bets.map((bet) => ({
      ...bet,
      timestamp: new Date().toISOString(), // This gives you a timestamp like "2024-06-22T12:30:45.678Z"
    }));

    // Convert current time to ISO string with milliseconds
    const timestampWithMilliseconds = new Date().toISOString().slice(0, -1);

    // Combine bets with timestamps
    betsWithTimestamps.forEach((bet) => {
      bet.timestamp = timestampWithMilliseconds;
    });

    setPlacedBets([...placedBets, ...betsWithTimestamps]);

    setBetSlip([]);
  };

  const contextValue = {
    sports,
    countries,
    matches,
    betSlip,
    placedBets,
    loading,
    error,
    selectedCountry,
    setSelectedCountry,
    selectedSport,
    setSelectedSport,
    selectedLeague,
    setSelectedLeague,
    selectedLeagueLable,
    setSelectedLeagueLable,
    handleSportSelect,
    handleCountrySelect,
    handleLeagueSelect,
    fetchCountries,
    fetchMatches,
    fetchMatchResult,
    addToBetSlip,
    placeBets,
    setBetSlip,
    matchResult,
    balance,
    setBalance,
    freeBalance,
    setFreeBalance,
    setPlacedBets,
    setFetchSport,
  };

  return (
    <FootballContext.Provider value={contextValue}>
      {children}
    </FootballContext.Provider>
  );
};

export default FootballContextProvider;
