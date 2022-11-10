import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { openSpotlight, SpotlightProvider } from "@mantine/spotlight";
import { useRouter } from "next/router";
import { useState } from "react";
import { AddressBook, Check, Search, X } from "tabler-icons-react";
import { v4 } from "uuid";
import {
  fetchPaymentControllerCreate,
  useAddressControllerFindAll,
} from "../../../services/api/dev3Components";

const CreatePayment = () => {
  const nearWalletRegex =
    /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { isLoading, data, error } = useAddressControllerFindAll({});

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      memo: "",
      amount: 0,
      receiver: "",
      receiver_fungible: "",
      isFungibleToken: false,
    },

    validate: {
      receiver: (value) =>
        nearWalletRegex.test(value) ? null : "Invalid reciver address",
      receiver_fungible: (value, values) =>
        !values.isFungibleToken
          ? null
          : nearWalletRegex.test(value)
          ? null
          : "Invalid fungible token address",
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const handleSubmit = async ({
    memo,
    amount,
    receiver,
    receiver_fungible,
  }: {
    memo: string;
    amount: number;
    receiver: string;
    receiver_fungible: string;
  }) => {
    try {
      setLoading(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Creating a new payment request",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      const response = await fetchPaymentControllerCreate({
        body: {
          uid: v4(),
          memo,
          amount: amount.toString(),
          receiver,
          receiver_fungible,
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "Payment request created!",
        message: "Your payment request has been created. You can now share it.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      router.push(`/payments`);
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error creating payment request",
        message:
          "There was an error creating your payment request. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Text size="xl" weight={500}>
        Create payment request
      </Text>
      <Paper p="lg" sx={{ maxWidth: 600 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            withAsterisk
            label="Receiver account id"
            description="The account to which the funds will be sent"
            placeholder="Enter receiver account id"
            rightSection={
              <SpotlightProvider
                actions={
                  data?.results?.map((address) => ({
                    title: address.alias,
                    description: address.wallet,
                    onTrigger: () =>
                      form.setFieldValue("receiver", address.wallet),
                  })) ?? []
                }
                searchIcon={<Search size={18} />}
                searchPlaceholder="Search addresses..."
                nothingFoundMessage="No addresses available"
              >
                <ActionIcon
                  hidden={isLoading || data?.results?.length === 0}
                  size="lg"
                  onClick={() => openSpotlight()}
                  variant="filled"
                  radius={0}
                >
                  <AddressBook size={22} />
                </ActionIcon>
              </SpotlightProvider>
            }
            {...form.getInputProps("receiver")}
          />

          <Checkbox
            mt="md"
            label="Do you wish to receive fungible token instead of NEAR?"
            {...form.getInputProps("isFungibleToken", { type: "checkbox" })}
          />

          {form.values.isFungibleToken && (
            <TextInput
              mt="sm"
              label="Fungible token contract"
              placeholder="Enter fungible token contract id"
              {...form.getInputProps("receiver_fungible")}
            />
          )}

          <NumberInput
            mt="sm"
            label="Amount"
            placeholder="Enter amount"
            min={0}
            max={9999}
            step={0.1}
            precision={6}
            removeTrailingZeros
            {...form.getInputProps("amount")}
          />

          <Textarea
            mt="sm"
            label="Payment note (Optional)"
            description="The note which will be shown to the person paying. This is a good place to put a link to an invoice."
            placeholder="Enter payment note"
            {...form.getInputProps("memo")}
          />

          <Group position="right" mt="md">
            <Button type="submit" variant="light" disabled={loading}>
              Create payment request
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePayment;
