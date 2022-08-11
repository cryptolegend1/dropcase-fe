import { ethers } from "ethers";
import React, { createContext, useContext, useState } from "react";

export type WalletContextType = {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  library: ethers.providers.Web3Provider | null;
  setLibrary: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider | null>
  >;
  provider: any;
  setProvider: React.Dispatch<React.SetStateAction<any>>;
  chainId: number;
  setChainId: React.Dispatch<React.SetStateAction<number>>;
  network: number;
  setNetwork: React.Dispatch<React.SetStateAction<number>>;
};
const WalletContext = createContext<WalletContextType | null>(null);

export function WalletContextProvider({ children }: { children: any }) {
  const [account, setAccount] = useState("");
  const [library, setLibrary] = useState<ethers.providers.Web3Provider | null>(
    null
  );
  const [provider, setProvider] = useState();
  const [chainId, setChainId] = useState(0);
  const [network, setNetwork] = useState(0);
  return (
    <WalletContext.Provider
      value={{
        account,
        setAccount,
        library,
        setLibrary,
        provider,
        setProvider,
        chainId,
        setChainId,
        network,
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
