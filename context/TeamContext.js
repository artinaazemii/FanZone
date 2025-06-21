import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [mainTeam, setMainTeam] = useState(null);
  return (
    <TeamContext.Provider value={{ mainTeam, setMainTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
