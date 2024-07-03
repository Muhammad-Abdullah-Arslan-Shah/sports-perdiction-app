// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tablet from './components/Tablet';
import Home from './components/Home';
import MyBets from './components/MyBets';
import { loadSettings } from './Setting.js';
import FootballContextProvider from './context/FootballContextProvider';
import Navigation from './components/Navigation';

function App() {
 

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        await loadSettings();
        console.log("Loading App Labels from Setting.json... ")
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    initializeSettings();
  }, []);

 

  return (
    <Router>
      <FootballContextProvider>
        <Tablet>
          <Navigation />
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/MyBets" element={<MyBets />} />
          </Routes>
        </Tablet>
      </FootballContextProvider>
    </Router>
  );
}

export default App;
