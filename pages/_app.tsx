import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WalletContextProvider } from "../src/context/wallet";
import { DropcaseContextProvider } from "../src/context/dropcase";
import client from "apollo-client";
import { ApolloProvider } from "@apollo/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <DropcaseContextProvider>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </DropcaseContextProvider>
    </ApolloProvider>
  );
}
export default MyApp;
