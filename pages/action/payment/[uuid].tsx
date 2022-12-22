import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { utils } from "near-api-js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, X } from "tabler-icons-react";
import { useUserContext } from "../../../context/UserContext";
import { useWalletSelector } from "../../../context/WalletSelectorContext";
import {
  useProjectControllerFindById,
  useProjectControllerFindBySlug,
  useTransactionRequestControllerFindByUuid,
} from "../../../services/api/dev3Components";

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
  const { selector } = useWalletSelector();
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

  // const {
  //   isLoading: projectIsLoading,
  //   data: projectData,
  //   error: projectError,
  // } = useProjectControllerFindById(
  //   {
  //     pathParams: {
  //       id: paymentRequestData?.project_id as string,
  //     },
  //   },
  //   {
  //     enabled: Boolean(paymentRequestData?.project_id),
  //   }
  // );

  console.log(transactionRequestData);

  const parsedArgs = useMemo(() => {
    if (!transactionRequestData?.args) {
      return null;
    }

    if (typeof transactionRequestData.args === "string") {
      return JSON.parse(transactionRequestData.args);
    }

    return transactionRequestData.args;
  }, [transactionRequestData?.args]);

  const handleButtonClick = async () => {
    if (userContext.user === null) {
      return;
    }

    setLoading(true);

    showNotification({
      id: "loading-notification",
      loading: true,
      title: "Preparing transaction",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
    });

    try {
      const wallet = await selector.wallet();

      // let args: {
      //   request: {
      //     id: string | undefined;
      //     amount?: string | null;
      //     receiver_account_id: string | undefined;
      //     ft_token_account_id?: string | undefined;
      //   };
      // } = {
      //   request: {
      //     id: paymentRequestData?.uid,
      //     receiver_account_id: paymentRequestData?.receiver,
      //   },
      // };

      // if (
      //   paymentRequestData?.receiver_fungible !== undefined &&
      //   paymentRequestData?.receiver_fungible !== null &&
      //   paymentRequestData?.receiver_fungible !== ""
      // ) {
      //   args.request.ft_token_account_id =
      //     paymentRequestData?.receiver_fungible;
      // }

      // args.request.amount = args.request.ft_token_account_id
      //   ? paymentRequestData?.amount
      //   : utils.format.parseNearAmount(paymentRequestData?.amount);

      await wallet.signAndSendTransaction({
        signerId: userContext.user?.nearWalletAccountId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: transactionRequestData?.method as string,
              args: parsedArgs,
              gas: transactionRequestData?.gas ?? "1000000000000",
              deposit: "10000000000",
            },
          },
        ],
      });
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error while preparing transaction",
        message:
          "There was an error while preparing the transaction. Please try again.",
        icon: <X size={16} />,
        autoClose: 3000,
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (transactionRequestIsLoading) {
    return <Loader />;
  }

  if (transactionHashes) {
    return (
      <Alert icon={<Check size={16} />} title="Success">
        Transaction has been successfully signed.
      </Alert>
    );
  }

  // if (paymentRequestData?.receiver_fungible !== "") {
  //   return (
  //     <Alert icon={<AlertCircle size={16} />} color="red" title="WIP">
  //       Sorry, Fungible tokens are not yet supported.
  //     </Alert>
  //   );
  // }

  console.log(parsedArgs);

  return (
    <Box>
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
      <Paper
        mx="auto"
        maw={400}
        radius="md"
        withBorder
        className={classes.card}
        mt={ICON_SIZE / 3}
      >
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
            <Text size="xl" weight={500}>
              {parsedArgs?.["amount"]}{" "}
            </Text>
            <Badge size="xl">
              {transactionRequestData?.is_near_token ? "NEAR" : "NOT NEAR"}
            </Badge>

            <Text color="dimmed">on Testnet</Text>
          </Stack>
        </Card>

        <Stack mt="xl" align="center" spacing="xs">
          <Text size="xl">Receipient</Text>
          <Badge size="lg">{parsedArgs?.["receiver_id"]}</Badge>
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
    </Box>
  );
};

export default PaymentRequestDetail;
