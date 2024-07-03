import React, { useContext, useState } from "react";
import Balance from "./Balance";
import { Link, useLocation } from "react-router-dom";
import FootballContext from "../context/FootballContext";
import { navLabels } from "../Setting";
import PromoModal from "../Modals/PromoModal"; 

const Navigation = () => {
  const { balance, freeBalance, setFreeBalance } = useContext(FootballContext);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const location = useLocation(); // Get the current location
  const {
    appTitle,
    appLogo,
    freebetLogo,
    balanceLogo,
    homeButton,
    myBetButton,
    freeBalanceTooltip,
    currentBalanceTooltip
  } = navLabels;

  const toggleBalanceModal = () => {
    setIsBalanceModalOpen((prevState) => !prevState);
  };

  const togglePromoModal = () => {
    setIsPromoModalOpen((prevState) => !prevState);
  };

  return (
    <>
      <nav
        className="py-4 p-3 bg-[#080814] text-shadow-lg shadow-lg"
        style={{ borderBottom: "2px solid #2d3234" }}
      >
        <div className=" flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`bg-[#0e2a40] text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-700 rounded transition transform ${
                location.pathname === "/" ? "" : "hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner  hover:bg-slate-700"
              }`}
              onClick={location.pathname === "/" ? (e) => e.preventDefault() : null}
            >
              {homeButton}
            </Link>
            <Link
              to="/MyBets"
              className={`bg-[#0e2a40]  text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-700 rounded transition transform ${
                location.pathname === "/MyBets" ? "" :  " hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              }`}
              onClick={location.pathname === "/MyBets" ? (e) => e.preventDefault() : null}
            >
              {myBetButton}
            </Link>
          </div>
          {/* Middle (logo and title) */}
          <div className="flex justify-center items-center">
            <img
              src={appLogo}
              alt="Sports Portal Logo"
              className="w-10 h-10 mr-2 rounded-full shadow-md"
            />
            <span className="text-2xl font-bold text-white text-shadow-lg">
              {appTitle}
            </span>
          </div>
          {/* Right side */}
          <div className="flex items-center space-x-4 justify-end">
            <div className="relative group">
              <button
                onClick={toggleBalanceModal}
                className="bg-[#0e2a40] hover:bg-slate-700 text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-700 rounded transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              >
                <div className="flex items-center mx-1">
                  <img
                    src={balanceLogo}
                    alt="Balance logo"
                    className="w-6 h-6 mr-2 rounded-full shadow-md"
                  />
                  <span> {balance.toFixed(2)}</span>
                </div>
              </button>
              <div className="  border-slate-700 absolute z-50 w-full text-center bottom-[-36px] left-[75px] transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2"
             style={{
              backgroundColor: "#0e2a40",
              opacity: "0.8",
              boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
            }}
             
             >
                 {currentBalanceTooltip}
              </div>
            </div>
            <div className=" relative group">
              <button
                onClick={togglePromoModal}
                className="bg-[#0e2a40] hover:bg-slate-700 text-white font-bold py-2 px-4 border-b-4 border-slate-700 hover:border-slate-700 rounded transition transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-inner"
              >
                <div className="flex items-center mx-1">
                  <img
                    src={freebetLogo}
                    alt="Free bet Logo"
                    className="w-6 h-6 mr-2 rounded-full shadow-md"
                  />
                  <span>{freeBalance.toFixed(2)}</span>
                </div>
              </button>
              <div className="  border-slate-700 absolute text-center bottom-[-36px] left-[75px] z-50 w-full  transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2"
               
               style={{
                backgroundColor: "#0e2a40",
                opacity: "0.8",
                boxShadow: "0 0 10px 2px rgba(0, 170, 255, 0.8)",
              }}
               >
                {freeBalanceTooltip}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isBalanceModalOpen && <Balance toggleModal={toggleBalanceModal} />}
      {isPromoModalOpen && (
        <PromoModal
          toggleModal={togglePromoModal}
          setFreeBalance={setFreeBalance}
        />
      )}
    </>
  );
};

export default Navigation;
