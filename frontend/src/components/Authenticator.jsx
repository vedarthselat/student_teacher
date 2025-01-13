import { createContext, useState } from "react";

// Create Context
export const AuthContext = createContext();

// AuthProvider component to provide authentication context
export const AuthProvider = ({ children }) => {
  const [APIKey, setAPIKey] = useState(null); // Default is null

  const login = (key) => {
    setAPIKey(key); 
  };

  const logout = () => {
    setAPIKey(null); 
  };

  const isAuthenticated = !!APIKey; 

  return (
    <AuthContext.Provider value={{ APIKey, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
