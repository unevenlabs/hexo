import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import "src/styles/globals.css";

import { GlobalProvider } from "context/GlobalState";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/georgeroman/hexo",
});

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </GlobalProvider>
  );
}

export default MyApp;
