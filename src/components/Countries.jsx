import React, { useState, useContext, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import FootballContext from "../context/FootballContext";

import ProcessNav from "./ProcessNav";
import { useSpring, animated } from "@react-spring/web";
import { countryLabels } from "../Setting";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Countries = () => {
  const { countryTitle, searchValue, emptyMsg, populerImg } = countryLabels;
  const animation = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const { countries, handleCountrySelect } = useContext(FootballContext);
  const [search, setSearch] = useState("");

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const filteredCountries = useMemo(
    () =>
      countries.filter((country) =>
        country.countryName.toLowerCase().includes(search.toLowerCase())
      ),
    [countries, search]
  );

  const renderNoDataMessage = () => (
    <div className="flex items-center justify-center">
      <p className="text-2xl text-white mt-36">{emptyMsg}</p>
    </div>
  );

  return (
    <>
      <ProcessNav />
      <div className="p-4">
        <div className="flex justify-between mx-4 items-center mb-4 mr-4">
          <h1 className="text-2xl font-bold text-white">{countryTitle}</h1>
          <div className="relative w-[30vh]">
            <input
              type="text"
              placeholder={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-bar p-2 text-white w-full rounded-lg pl-10 bg-[#080814]"
              style={{ border: "2px solid #2d3234" }}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          </div>
        </div>
        {filteredCountries.length === 0 ? (
          renderNoDataMessage()
        ) : (
          <animated.div
            className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10"
            style={animation}
          >
            {filteredCountries.map((country, index) => (
              <button
                key={index}
                className="block transition duration-150 ease-in-out rounded-lg overflow-hidden shadow-md hover:scale-105"
                onClick={() => handleCountrySelect(country.countryName)}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(4, 4, 16, 0.8) 20%, rgba(12, 56, 85, 0.8) 100%)",
                  border: "solid 2px #045174",
                }}
              >
                <div className="flex items-center justify-between p-4">
                  <img
                    src={country.logoUrl || populerImg}
                    alt={country.countryName}
                    className="rounded-lg ml-2"
                    style={{
                      width: "48px",
                      height: "36px",
                    }}
                  />
                  <p
                    className="text-center text-white ml-1"
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {country.countryName}
                  </p>
                  <div></div>
                </div>
              </button>
            ))}
          </animated.div>
        )}
      </div>
    </>
  );
};

export default Countries;
