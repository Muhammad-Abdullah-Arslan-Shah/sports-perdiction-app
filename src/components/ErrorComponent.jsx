// src/ErrorComponent.js
import React from "react";

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex justify-center h-[100%] items-center ">
      <div className="text-red-500 text-2xl">{error}</div>
    </div>
  );
};

export default ErrorComponent;
