import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import "@near-wallet-selector/modal-ui/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProps } from "next/app";
import Head from "next/head";
import AppLayout from "../components/layout/app.layout";
import { ProjectContextProvider } from "../context/ProjectContext";
import { UserContextProvider } from "../context/UserContext";
import { WalletSelectorContextProvider } from "../context/WalletSelectorContext";

const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const preferredColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>Dev3</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <ProjectContextProvider>
            <WalletSelectorContextProvider>
              <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
              >
                <MantineProvider
                  withGlobalStyles
                  withNormalizeCSS
                  theme={{
                    colorScheme,
                  }}
                >
                  <NotificationsProvider>
                    <AppLayout>
                      <Component {...pageProps} />
                    </AppLayout>
                  </NotificationsProvider>
                </MantineProvider>
              </ColorSchemeProvider>
            </WalletSelectorContextProvider>
          </ProjectContextProvider>
        </UserContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
