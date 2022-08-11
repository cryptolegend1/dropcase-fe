import React, { createContext, useContext, useMemo, useState } from "react";
export type DropcaseContextType = {
  currentDropcaseId: number;
  setCurrentDropcaseId: React.Dispatch<React.SetStateAction<number>>;
  dropcaseTokenIds: number[];
  setDropcaseTokenIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentNFTId: number;
  setCurrentNFTId: React.Dispatch<React.SetStateAction<number>>;
  isTxnProcessing: boolean;
  setIsTxnProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};
const DropcaseContext = createContext<DropcaseContextType | null>(null);

export function DropcaseContextProvider({ children }: { children: any }) {
  const [currentDropcaseId, setCurrentDropcaseId] = useState(0);
  const [currentNFTId, setCurrentNFTId] = useState(0);
  const [dropcaseTokenIds, setDropcaseTokenIds] = useState<number[]>([]);
  const [isTxnProcessing, setIsTxnProcessing] = useState(false);
  return (
    <DropcaseContext.Provider
      value={{
        currentDropcaseId,
        setCurrentDropcaseId,
        dropcaseTokenIds,
        setDropcaseTokenIds,
        currentNFTId,
        setCurrentNFTId,
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
