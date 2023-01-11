import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  createStyles,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { AlertCircle, Check } from "tabler-icons-react";

import { useUserContext } from "../../../context/UserContext";
import { useWalletSelector } from "../../../context/WalletSelectorContext";
import { useTransactionRequestControllerFindByUuid } from "../../../services/api/dev3Components";
import { getInfoFromArgs, NEAR_CONTRACT_ID } from "../../../utils/near";
import { notifications } from "../../../utils/notifications";

const ICON_SIZE = 80;

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl * 1.5 + ICON_SIZE / 3,
  },

  icon: {
    position: "absolute",
    top: -ICON_SIZE / 3,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },

  title: {
    lineHeight: 1,
  },
}));

const PaymentRequestDetail = () => {
  const { selector, callMethod } = useWalletSelector();
  const { classes } = useStyles();
  const router = useRouter();
  const { params, errorCode, errorMessage, transactionHashes, uuid } =
    router.query;

  const userContext = useUserContext();

  const [loading, setLoading] = useState<boolean>(false);

  const {
    isLoading: transactionRequestIsLoading,
    data: transactionRequestData,
  } = useTransactionRequestControllerFindByUuid({
    pathParams: {
      uuid: uuid as string,
    },
  });

  const parsedArgs = useMemo(() => {
    if (!transactionRequestData?.args) {
      return null;
    }

    let args = transactionRequestData.args;

    if (typeof args === "string") {
      args = JSON.parse(args);
    }

    if (args.request) {
      return {
        request: {
          ...args.request,
          id: transactionRequestData.uuid,
        },
      };
    }

    return args;
  }, [transactionRequestData?.args, transactionRequestData?.uuid]);

  const parsedInfo = useMemo(() => {
    if (!(parsedArgs && transactionRequestData)) {
      return;
    }

    return getInfoFromArgs(parsedArgs, transactionRequestData.meta);
  }, [parsedArgs, transactionRequestData]);

  const handleButtonClick = async () => {
    if (userContext.user === null) {
      return;
    }

    if (!transactionRequestData) {
      return;
    }

    setLoading(true);

    notifications.create({
      title: "Preparing transaction",
      message: "Please wait...",
    });

    try {
      const { contractId, method, deposit, gas, is_near_token } =
        transactionRequestData;

      await callMethod(
        (is_near_token ? NEAR_CONTRACT_ID : contractId) as string,
        method,
        parsedArgs,
        deposit,
        gas
      );
    } catch (error) {
      notifications.error({
        title: "Error while preparing transaction",
        message:
          "There was an error while preparing the transaction. Please try again.",
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (transactionRequestIsLoading) {
    return (
      <Container>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (transactionHashes) {
    return (
      <Container size="xs">
        <Alert icon={<Check size={16} />} title="Success">
          Transaction has been successfully signed.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xs">
      {errorCode && errorCode === "userRejected" && (
        <Alert
          mb={40}
          icon={<AlertCircle size={16} />}
          title="Transaction rejected by user"
          color="red"
        >
          You rejected the transaction.
        </Alert>
      )}

      {errorCode && errorCode !== "userRejected" && errorMessage && (
        <Alert
          mb={40}
          icon={<AlertCircle size={16} />}
          title="Something went wrong"
          color="red"
        >
          Please try again.
        </Alert>
      )}
      <Paper radius="md" withBorder className={classes.card} mt={ICON_SIZE / 3}>
        <Avatar
          src={transactionRequestData?.project.logo_url}
          className={classes.icon}
          size={ICON_SIZE}
          radius={ICON_SIZE}
        />

        <Text align="center" weight={700} className={classes.title}>
          {transactionRequestData?.project.name}
        </Text>
        <Text color="dimmed" align="center" size="sm">
          is requesting payment
        </Text>

        <Card mt="md" shadow="none" p="lg" radius="md" withBorder>
          <Stack align="center" spacing="sm">
            {transactionRequestData?.meta?.icon && (
              <Avatar src={transactionRequestData.meta.icon} size={40} />
            )}
            {transactionRequestData?.meta?.name && (
              <Text size="xl" weight={500}>
                {transactionRequestData.meta.name}
              </Text>
            )}

            <Text size="xl" weight={500}>
              {parsedInfo?.amount}
            </Text>
            <Badge size="xl">
              {transactionRequestData?.is_near_token
                ? "NEAR"
                : transactionRequestData?.meta?.symbol}
            </Badge>

            <Text color="dimmed">on Testnet</Text>
          </Stack>
        </Card>

        <Stack mt="xl" align="center" spacing="xs">
          <Text size="xl">Receipient</Text>
          <Badge size="lg">{parsedInfo?.receiver_id}</Badge>
        </Stack>

        <Center mt="xl">
          <Button
            disabled={userContext.user === null || loading}
            fullWidth
            variant="light"
            onClick={handleButtonClick}
          >
            {userContext.user === null ? "You need to connect a wallet" : "Pay"}
          </Button>
        </Center>
      </Paper>
    </Container>
  );
};

export default PaymentRequestDetail;
