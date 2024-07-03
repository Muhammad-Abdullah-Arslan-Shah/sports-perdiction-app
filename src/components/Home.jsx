import React, { useContext, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import ErrorComponent from "./ErrorComponent";
import FootballContext from "../context/FootballContext";
import Sports from "./Sports";
import Countries from "./Countries";
import MatchItem from "./MatchItem";
import Leagues from "./Leagues";
import BetSlip from "./BetSlip";
import { FaArrowUp } from 'react-icons/fa'; // Importing the arrow-up icon from React Icons


const Home = () => {
  const { loading, error } = useContext(FootballContext);
  const location = useLocation(); // Get the current location
  const [showScrollUp, setShowScrollUp] = useState(false);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current.scrollTop > 100) {
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

  return (
    <>
      {/* Main Content */}
      <div className="flex h-full  " >
        {/* Left Container */}
        <div
          className="flex-1 overflow-y-auto scrollbar-custom overflow-x-hidden"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {error ? (
            <ErrorComponent error={error.message} />
          ) : loading ? (
            <div style={{ top: "55%",
              left: "35%"}}  >
            <LoadingSpinner />

              </div>
          ) : (
            <Routes location={location}>
              <Route path="/sports" element={<Sports />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/leagues" element={<Leagues />} />
              <Route path="/matches" element={<MatchItem />} />
              <Route path="/" element={<Sports />} />
            </Routes>
          )}
        </div>

        {/* Scroll Up Button Container */}
        {showScrollUp && (
          <div
            className="absolute bottom-[10%] left-0 right-[33.9%] flex justify-center  "
            style={{ zIndex: "1000" }}
          >
            <button
              className="rounded-full p-2 shadow-sm "
              onClick={scrollToTop}
              style={{
                backgroundColor: "#080814",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
            >
              <FaArrowUp color="white" size={15} />
            </button>
          </div>
        )}

        {/* Right Container */}
        <div
          className=" w-1/3  "
          style={{  borderLeft: "2px solid #2d3234" }}
        >
          <BetSlip />
        </div>
      </div>
    </>
  );
};

export default Home;
