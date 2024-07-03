import React, { useEffect } from 'react';
import { animated, useSpring } from "@react-spring/web";

const SuccessModal = ({ message, onClose, successMsg1 ,successMsg2,balanceAddedonOnSuccess}) => {
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
    <animated.div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <div className="max-w-lg  mt-16 text-white rounded-lg  w-full shadow-lg relative h-72 flex items-center justify-center  "
           style={{
           ...animation,
             background: "linear-gradient(180deg, rgba(4, 4, 16 ) 20%, rgba(12, 56, 85 ) 100%)",
             border: "solid 2px #045174",
           }}>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-black text-lg font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col items-center " >
        <div className="success-message">
            <div className="success-checkmark"></div>
            {message==="show promo msg"?(<div className='mt-2'><p>{successMsg1} <br/> <br/> <span className='text-green-400'> {balanceAddedonOnSuccess}€ </span> {successMsg2}</p></div>):
            <p className="mt-4 text-white">{message}</p>}
          </div>
         
        </div>
      </div>
    </animated.div>
  );
};

export default SuccessModal;
