import {
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
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
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
  const { classes } = useStyles();
  const router = useRouter();
  const { params } = router.query;

  const userContext = useUserContext();

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
  }, [paymentRequestData, router]);

  const handleButtonClick = () => {
    if (userContext.user === null) {
      return;
    }

    showNotification({
      id: "WIP",
      title: "Work in progress",
      message: "This feature is not yet implemented.",
      color: "blue",
    });
  };

  if (projectIsLoading || paymentRequestIsLoading) {
    return <Loader />;
  }

  return (
    <Box>
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
            <Text size="xl" weight={500}>
              {paymentRequestData?.amount}{" "}
            </Text>
            <Badge size="xl">
              {paymentRequestData?.receiver_fungible !== ""
                ? paymentRequestData?.receiver_fungible
                : "NEAR"}
            </Badge>

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
            disabled={userContext.user === null}
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
