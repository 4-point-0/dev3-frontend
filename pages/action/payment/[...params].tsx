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
import { useEffect, useState } from "react";
import { AlertCircle, Check, X } from "tabler-icons-react";
import { useUserContext } from "../../../context/UserContext";
import { useWalletSelector } from "../../../context/WalletSelectorContext";
import {
  usePaymentControllerFindByUid,
  useProjectControllerFindBySlug,
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
  const { selector, callMethod, viewMethod } = useWalletSelector();
  const { classes } = useStyles();
  const router = useRouter();
  const { params, errorCode, errorMessage, transactionHashes } = router.query;

  const userContext = useUserContext();

  const [loading, setLoading] = useState<boolean>(false);

  const [ftDecimals, setFtDecimals] = useState<number>(0);
  const [ftSymbol, setFtSymbol] = useState<string>("");
  const [ftName, setFtName] = useState<string>("");
  const [ftIcon, setFtIcon] = useState<string>("");

  const {
    isLoading: projectIsLoading,
    data: projectData,
    error: projectError,
  } = useProjectControllerFindBySlug({
    pathParams: {
      slug: params?.[0] as string,
    },
  });

  const {
    isLoading: paymentRequestIsLoading,
    data: paymentRequestData,
    error: paymentRequestError,
  } = usePaymentControllerFindByUid({
    pathParams: {
      uid: params?.[1] as string,
    },
  });

  useEffect(() => {
    if (paymentRequestData?.status === "paid") {
      router.push(`/`);
    }

    if (paymentRequestData?.receiver_fungible !== "") {
      const getFtMetadata = async () => {
        const metadata = await viewMethod(
          paymentRequestData?.receiver_fungible as string,
          "ft_metadata",
          null
        );

        setFtDecimals(metadata.decimals);
        setFtSymbol(metadata.symbol);
        setFtName(metadata.name);
        setFtIcon(metadata.icon);
      };

      getFtMetadata();
    }
  }, [paymentRequestData, router, viewMethod]);

  const handleNearPay = async () => {
    if (!paymentRequestData)
      throw new Error("Payment request data is not available");

    const nearAmount = utils.format.parseNearAmount(
      paymentRequestData?.amount
    ) as string;

    await callMethod(
      "dev-1668975558141-76613200431681",
      "transfer_funds",
      {
        request: {
          id: paymentRequestData.uid,
          receiver_account_id: paymentRequestData.receiver,
          amount: nearAmount,
        },
      },
      nearAmount,
      "30000000000000"
    );
  };

  const handleFungiblePay = async () => {
    if (!paymentRequestData || !paymentRequestData?.receiver_fungible)
      throw new Error("No fungible token address provided");

    await callMethod(
      paymentRequestData.receiver_fungible,
      "ft_transfer",
      {
        receiver_id: paymentRequestData.receiver,
        amount: (
          parseInt(paymentRequestData.amount) *
          10 ** ftDecimals
        ).toString(),
        // msg: paymentRequestData.memo,
      },
      "1",
      "30000000000000"
    );
  };

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
      if (paymentRequestData?.receiver_fungible) {
        await handleFungiblePay();
      } else {
        await handleNearPay();
      }
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

  if (projectIsLoading || paymentRequestIsLoading) {
    return <Loader />;
  }

  if (transactionHashes) {
    return (
      <Alert icon={<Check size={16} />} title="Success">
        Transaction has been successfully signed.
      </Alert>
    );
  }

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
          src={projectData?.logoUrl}
          className={classes.icon}
          size={ICON_SIZE}
          radius={ICON_SIZE}
        />

        <Text align="center" weight={700} className={classes.title}>
          {projectData?.name}
        </Text>
        <Text color="dimmed" align="center" size="sm">
          is requesting payment
        </Text>

        <Card mt="md" shadow="none" p="lg" radius="md" withBorder>
          <Stack align="center" spacing="sm">
            {ftIcon !== "" && <Avatar src={ftIcon} size={40} />}
            {ftName !== "" && (
              <Text size="xl" weight={500}>
                {ftName}
              </Text>
            )}

            <Text size="xl" weight={500}>
              {paymentRequestData?.amount}{" "}
            </Text>
            <Badge size="xl">{ftSymbol !== "" ? ftSymbol : "NEAR"}</Badge>

            <Text color="dimmed">on Testnet</Text>
          </Stack>
        </Card>

        <Stack mt="xl" align="center" spacing="xs">
          <Text size="xl">Receipient</Text>
          <Badge size="lg">{paymentRequestData?.receiver}</Badge>
        </Stack>

        <Stack mt="xl" align="center" spacing="xs">
          <Text size="xl">Memo</Text>
          <Text color="dimmed">{paymentRequestData?.memo}</Text>
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
