import React, { useState, useContext } from "react";
import { useSpring, animated } from "@react-spring/web";
import FootballContext from "../context/FootballContext";
import { FaSearch } from "react-icons/fa"; 
import { countryLabels } from "../Setting";
const Sports = () => {
  const { sports, handleSportSelect} = useContext(FootballContext);
  const [search, setSearch] = useState("");
  const{searchValue} = countryLabels
  const filteredSports = sports.filter((sport) =>
    sport.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const animation =useSpring( {
    to:{opacity:1,scale:"scale(1)"},
    from:{opacity:0,scale:"scale(0.5)"},
    config:{duration:800}

  });
  return (
    <div className="p-4 text-white  text-shadow-lg" >
      <div className="flex justify-end items-center mb-4 mr-4">
        <div className="relative w-[30vh]">
          <input
            type="text"
            placeholder={searchValue}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar p-2 w-full rounded-lg pl-10 bg-[#080814]"
            style={{ border: "2px solid #2d3234" }}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
        </div>
      </div>

      <animated.div className="flex flex-wrap justify-center" style={animation}  >
        {filteredSports.map((sport, index) => (
          <div key={index} className="rounded-lg hover:scale-105 transition-transform duration-300 " style={{ background: "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)", border: "solid 2px #045174", flexBasis: "calc(25% - 1rem)", marginBottom: "1rem", marginRight: "1rem" }}>
            <button onClick={() => handleSportSelect(sport.name)}>
              <img
                src={sport.logoUrl}
                className="rounded"
                alt={sport.displayName}
                style={{ width: "100%", height: "auto" }}
              />
            </button>
            <p className="p-1 text-center">
              {sport.displayName}
            </p>
          </div>
        ))}
      </animated.div>
    </div>
  );
};

export default Sports;