import { Box, useMantineTheme } from "@mantine/core";
import type { NextPage } from "next";
import WalletConnectButton from "../components/WalletConnectButton";

const Home: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <Box m={theme.spacing.lg}>
      <WalletConnectButton />
    </Box>
  );
};

export default Home;
