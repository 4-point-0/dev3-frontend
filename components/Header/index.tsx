import {
  ActionIcon,
  Box,
  Burger,
  CopyButton,
  Group,
  Header,
  MantineTheme,
  MediaQuery,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import * as nearApi from "near-api-js";
import { providers } from "near-api-js";
import { AccountView } from "near-api-js/lib/providers/provider";
import Image from "next/image";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "tabler-icons-react";
import logoDark from "../../assets/dev3-dark.png";
import logoLight from "../../assets/dev3-light.png";
import { useUserContext } from "../../context/UserContext";
import { useWalletSelector } from "../../context/WalletSelectorContext";
import ThemeTogglerButton from "../ThemeTogglerButton";
import WalletConnectButton from "../WalletConnectButton";

import {
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter,
} from "@novu/notification-center";
import { useRouter } from "next/router";

export interface AdminHeaderProps {
  theme: MantineTheme;
  opened: boolean;
  setOpened: (value: SetStateAction<boolean>) => void;
}

const AppHeader = ({ theme, opened, setOpened }: AdminHeaderProps) => {
  const router = useRouter();

  function onNotificationClick(notification: any) {
    router.push(notification.cta.data.url);
  }

  const userContext = useUserContext();
  const { selector, accountId } = useWalletSelector();
  const [account, setAccount] = useState<AccountView | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccount = useCallback(async (): Promise<AccountView | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  return (
    <Header height={70} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Image
          src={theme.colorScheme === "dark" ? logoDark : logoLight}
          alt="Dev3 Logo"
          height={40}
          width={120}
        />

        <Box ml="auto">
          <Group>
            <Paper hidden={!userContext.user} p="xs" withBorder>
              <Group spacing={4}>
                <Text>Account Id: </Text>
                <Text color="dimmed">
                  {userContext.user?.nearWalletAccountId}
                </Text>
                <CopyButton
                  value={userContext.user?.nearWalletAccountId ?? ""}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="bottom"
                    >
                      <ActionIcon
                        radius="xl"
                        variant="light"
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
                <Tooltip
                  label="View on NEAR Explorer"
                  withArrow
                  position="bottom"
                >
                  <ActionIcon
                    radius="xl"
                    variant="light"
                    component="a"
                    target="_blank"
                    href={`https://explorer.testnet.near.org/accounts/${userContext.user?.nearWalletAccountId}`}
                  >
                    <ExternalLink size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Paper>
            <Paper p="xs" withBorder hidden={!userContext.user}>
              <Group spacing={4}>
                <Text>Balance: </Text>
                <Text color="dimmed">
                  {nearApi.utils.format.formatNearAmount(
                    account?.amount ?? "0",
                    2
                  )}{" "}
                  Ⓝ
                </Text>
                <Tooltip
                  label="Get more NEAR using faucet"
                  withArrow
                  position="bottom"
                >
                  <ActionIcon
                    radius="xl"
                    variant="light"
                    component="a"
                    target="_blank"
                    href="https://near-faucet.io/"
                  >
                    <ExternalLink size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Paper>

            {userContext.user && (
              <NovuProvider
                subscriberId={userContext.user.nearWalletAccountId}
                applicationIdentifier={
                  process.env.NEXT_PUBLIC_NOVU_APP_ID || ""
                }
              >
                <PopoverNotificationCenter
                  colorScheme={theme.colorScheme === "dark" ? "dark" : "light"}
                  onNotificationClick={onNotificationClick}
                >
                  {({ unseenCount }) => (
                    <NotificationBell unseenCount={unseenCount} />
                  )}
                </PopoverNotificationCenter>
              </NovuProvider>
            )}

            <WalletConnectButton />
            <ThemeTogglerButton />
          </Group>
        </Box>
      </div>
    </Header>
  );
};

export default AppHeader;
