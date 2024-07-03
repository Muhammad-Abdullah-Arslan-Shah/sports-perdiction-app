import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import FootballContext from "../context/FootballContext";
import { useNavigate } from 'react-router-dom';

const Tablet = ({ children }) => {
  let navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);
  const { setFetchSport } = useContext(FootballContext);

  const animation = useSpring({
    from: { opacity: -1, transform: 'translateY(-150px)' },
    to: isReversing || !isVisible
      ? { opacity: -1, transform: 'translateY(-150px)' }
      : { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 700 },
    onRest: () => {
      if (!isReversing && isVisible) {
        setShouldRenderChildren(true);
      } else {
        setShouldRenderChildren(false);
      }
    },
  });

  const handleSideButtonClick = () => {
    setIsReversing(true);
    setTimeout(() => {
      setIsVisible(false);
      navigate("/");
    }, 700);
  };

  // Removed handleKeyPress function and associated useEffect

  useEffect(() => {
    const handleReload = () => {
      navigate("/");
    };
    window.addEventListener('load', handleReload);
    return () => {
      window.removeEventListener('load', handleReload);
    };
  }, [navigate]);

  return (
    <animated.div className="flex justify-center items-center h-screen relative" style={animation}>
      {isVisible && (
        <div
          className="tablet-container bg-black rounded-3xl shadow-lg p-2 relative"
          style={{ width: '80%', height: '90%', maxWidth: '80%', maxHeight: '90%', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.4)' }}
        >
          {/* Power button on the left side */}
          <div
            className="absolute left-[-0.3%] top-1/3 transform -translate-y-1/2 bg-black rounded-lg cursor-pointer"
            style={{ width: '1%', height: '7%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}
            onClick={handleSideButtonClick}
          ></div>

          {/* Volume buttons on the top */}
          <div
            className="absolute top-[-0.5%] left-[20%] transform -translate-x-1/2 bg-black rounded-lg"
            style={{ width: '8%', height: '2%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}
          ></div>
          <div
            className="absolute top-[-0.5%] left-[29%] transform -translate-x-1/2 bg-black rounded-lg"
            style={{ width: '8%', height: '2%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}
          ></div>
          <div
            className="absolute top-[-0.5%] left-[38%] transform -translate-x-1/2 bg-black rounded-lg"
            style={{ width: '8%', height: '2%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}
          ></div>

          {/* Tablet screen */}
          <div
            className="tablet-screen text-shadow-lg bg-[#1d1d28] rounded-lg overflow-hidden mt-3 mx-2 "
            style={{ height: '94%', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)' }}
          >
            {shouldRenderChildren ? (
              children
            ) : (
              <div className="loader-container-tablet">
                <div className="loader">
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                  <div className="bar4"></div>
                  <div className="bar5"></div>
                  <div className="bar6"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </animated.div>
  );
};

export default Tablet;
