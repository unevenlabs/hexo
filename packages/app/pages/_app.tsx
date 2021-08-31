import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import "../src/styles/globals.css";

import Web3ReactManager from "../components/Web3ReactManager";
import { GlobalProvider } from "../context/GlobalState";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // TODO: Find a way to dynamically change the subgraph endpoint
  uri: "https://api.thegraph.com/subgraphs/name/georgeroman/hexo-rinkeby",
});

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
        <Web3ReactManager>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Web3ReactManager>
      </Web3ReactProvider>
    </GlobalProvider>
  );
}

export default MyApp;
