import React, {createContext, useState} from 'react';

const DataContext = createContext();

export const DataProvider = ({children}) => {
  const [sharedData, setSharedData] = useState({});

  const updateSharedData = newValue => {
    setSharedData(newValue);
  };

  return (
    <DataContext.Provider value={{sharedData, updateSharedData}}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
