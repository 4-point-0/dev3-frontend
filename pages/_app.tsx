import { MantineProvider } from "@mantine/core";
import "@near-wallet-selector/modal-ui/styles.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../context/WalletSelectorContext";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Dev3</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <WalletSelectorContextProvider>
          <Component {...pageProps} />
        </WalletSelectorContextProvider>
      </MantineProvider>
    </>
  );
}
