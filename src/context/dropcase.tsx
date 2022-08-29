import React, { createContext, useContext, useMemo, useState } from "react";
export type DropcaseContextType = {
  currentDropcaseId: number;
  setCurrentDropcaseId: React.Dispatch<React.SetStateAction<number>>;
  dropcaseTokenIds: number[];
  setDropcaseTokenIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentNFT: any;
  setCurrentNFT: React.Dispatch<React.SetStateAction<any>>;
  alchemyWeb3: any;
  setAlchemyWeb3: React.Dispatch<React.SetStateAction<any>>;
  isTxnProcessing: boolean;
  setIsTxnProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};
const DropcaseContext = createContext<DropcaseContextType | null>(null);

export function DropcaseContextProvider({ children }: { children: any }) {
  const [currentDropcaseId, setCurrentDropcaseId] = useState(0);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [dropcaseTokenIds, setDropcaseTokenIds] = useState<number[]>([]);
  const [isTxnProcessing, setIsTxnProcessing] = useState(false);
  const [alchemyWeb3, setAlchemyWeb3] = useState(null);
  return (
    <DropcaseContext.Provider
      value={{
        currentDropcaseId,
        setCurrentDropcaseId,
        dropcaseTokenIds,
        setDropcaseTokenIds,
        currentNFT,
        setCurrentNFT,
        alchemyWeb3,
        setAlchemyWeb3,
        isTxnProcessing,
        setIsTxnProcessing,
      }}
    >
      {children}
    </DropcaseContext.Provider>
  );
}

export function useDropcaseContext() {
  return useContext(DropcaseContext);
}
