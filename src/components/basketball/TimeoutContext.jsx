import React, { createContext, useContext, useState, useEffect } from 'react';

const TimeoutContext = createContext();

export const useTimeout = () => {
  const context = useContext(TimeoutContext);
  if (!context) {
    throw new Error('useTimeout must be used within TimeoutProvider');
  }
  return context;
};

export const TimeoutProvider = ({ children }) => {
  const [timeout, setTimeout] = useState({
    isActive: false,
    remainingTime: 0,
    teamName: '',
    teamColor: '',
    duration: 0
  });

  useEffect(() => {
    if (timeout.isActive && timeout.remainingTime > 0) {
      const interval = setInterval(() => {
        setTimeout(prev => {
          if (prev.remainingTime <= 1) {
            return {
              isActive: false,
              remainingTime: 0,
              teamName: '',
              teamColor: '',
              duration: 0
            };
          }
          return {
            ...prev,
            remainingTime: prev.remainingTime - 1
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeout.isActive, timeout.remainingTime]);

  const startTimeout = ({ teamName, teamColor, duration }) => {
    setTimeout({
      isActive: true,
      remainingTime: duration,
      teamName,
      teamColor,
      duration
    });
  };

  const cancelTimeout = () => {
    setTimeout({
      isActive: false,
      remainingTime: 0,
      teamName: '',
      teamColor: '',
      duration: 0
    });
  };

  return (
    <TimeoutContext.Provider value={{ timeout, startTimeout, cancelTimeout }}>
      {children}
    </TimeoutContext.Provider>
  );
};