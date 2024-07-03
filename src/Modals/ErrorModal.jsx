import React, { useEffect } from 'react';
import { animated, useSpring } from "@react-spring/web";

const ErrorModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call the onClose function after 3 seconds
    }, 3000);
    // Clean up the timer
    return () => clearTimeout(timer);
  }, [onClose]);


  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <animated.div
        className="max-w-lg w-full mt-16  text-white flex items-center justify-center rounded-lg shadow-lg relative h-72 flex items-center justify-center "
        style={{
          background: "linear-gradient(180deg, rgba(4, 4, 16) 20%, rgba(12, 56, 85) 100%)",
          border: "solid 2px #045174",
          ...animation
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-white text-lg font-bold"
        >
         
        </button>
        <div className="flex flex-col items-center">
          <div className="error-message">
            <div className="error-crossmark"></div>
          </div>
          <p className="text-center mt-4">{message}</p>
        </div>
      </animated.div>
    </div>
  );
};

export default ErrorModal;
