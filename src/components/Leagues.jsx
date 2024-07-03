import React, { useState, useContext } from 'react';
import FootballContext from '../context/FootballContext';
import { useSpring, animated } from "@react-spring/web";
import ProcessNav from "./ProcessNav";
import { FaSearch } from "react-icons/fa"; // Importing the search icon
import { leagueLabels } from "../Setting"; // Correct spelling

const Leagues = () => {
  const { countries, selectedCountry, handleLeagueSelect } = useContext(FootballContext);
  const [search, setSearch] = useState("");
  const { leagueTitle, noContentMsg,searchValue } = leagueLabels;

  const animation = useSpring({
    to: { opacity: 1,  },
    from: { opacity: 0, },
    config: { duration: 800 }
  });

  // Find the selected country from the countries array
  const country = countries.find(country => country.countryName === selectedCountry);

  // Get the leagues array or set it to an empty array if undefined
  const leagues = country ? country.leagues : [];
  const filteredLeagues = leagues.filter(league =>
    league.label.toLowerCase().includes(search.toLowerCase())
  );

  if (leagues.length === 0) {
    return <div className="text-red-500">{noContentMsg}</div>;
  }

  return (
    <>
      <ProcessNav />
      <div className='p-4'>
        <div className="flex justify-between items-center mb-4 mx-4 mr-4">
          <h1 className="text-2xl font-bold text-white">{leagueTitle}</h1>
          <div className="relative w-[30vh]">
            <input
              type="text"
              placeholder={searchValue }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar p-2 w-full rounded-lg pl-10 bg-[#080814]"
              style={{ border: "2px solid #2d3234" }}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          </div>
        </div>
        <animated.div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={animation}>
          {filteredLeagues.map((league, index) => (
            <button
              key={index}
              className="block transition duration-150 ease-in-out rounded-lg overflow-hidden shadow-md hover:scale-105"
              style={{ background: "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)", border: "solid 2px #045174" }}
              onClick={() => handleLeagueSelect(league.value, league.label)}
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2">{league.label}</h2>
              </div>
            </button>
          ))}
        </animated.div>
      </div>
    </>
  );
};

export default Leagues;
