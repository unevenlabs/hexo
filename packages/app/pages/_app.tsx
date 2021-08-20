import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import "tailwindcss/tailwind.css";

import Web3ReactManager from "../src/components/Web3ReactManager";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // TODO: Find a way to dynamically change the subgraph endpoint
  uri: "https://api.thegraph.com/subgraphs/name/georgeroman/hexo-rinkeby",
});

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
      <Web3ReactManager>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

export default MyApp;
