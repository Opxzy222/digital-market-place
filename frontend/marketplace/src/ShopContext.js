import React, { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [currentShop, setCurrentShop] = useState(null);

  return (
    <ShopContext.Provider value={{ currentShop, setCurrentShop }}>
      {children}
    </ShopContext.Provider>
  );
};
