import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import "tailwindcss/tailwind.css";

import Web3ReactManager from "../src/components/Web3ReactManager";

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
      <Web3ReactManager>
        <Component {...pageProps} />
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

export default MyApp;
