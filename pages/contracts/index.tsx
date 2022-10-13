import { Box, useMantineTheme } from "@mantine/core";
import { NextPage } from "next";

const Contracts: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <Box m={theme.spacing.lg}>
      <h1>Contracts</h1>
    </Box>
  );
};

export default Contracts;
