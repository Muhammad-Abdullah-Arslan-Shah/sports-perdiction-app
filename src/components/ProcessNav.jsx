import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FootballContext from "../context/FootballContext";
import { countryLabels,leagueLabels } from "../Setting";
const ProcessNav = () => {
  const {
    selectedSport,
    selectedCountry,
    selectedLeagueLable,
    setSelectedSport,
    setSelectedCountry,
    setSelectedLeagueLable,
  } = useContext(FootballContext);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in history
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedSport(null);
      setSelectedCountry(null);
      setSelectedLeagueLable(null);
    } else if (location.pathname === "/countries") {
      setSelectedCountry(null);
      setSelectedLeagueLable(null);
    } else if (location.pathname === "/leagues") {
      setSelectedLeagueLable(null);
    }
  }, [location.pathname, setSelectedSport, setSelectedCountry, setSelectedLeagueLable]);

  return (
    <div className="p-2 mb-2 text-sm text-white flex items-center">
      <button onClick={handleGoBack} className="mr-2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <span>
        {selectedSport ? (
          <Link to="/">
            {selectedSport.toUpperCase()}
          </Link>
        ) : (
          "Select Sport"
        )}
      </span>
      {selectedSport && (
        <>
          {" > "}
          <span>{selectedCountry ? <Link to="/countries">{selectedCountry}</Link> :  countryLabels.navigation}</span>
        </>
      )}
      {selectedCountry && (
        <>
          {" > "}
          <span>{selectedLeagueLable ? <Link to="/leagues">{selectedLeagueLable}</Link> :leagueLabels.navigation }</span>
        </>
      )}
     
    </div>
  );
};

export default ProcessNav;
