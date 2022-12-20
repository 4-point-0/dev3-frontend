import {
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";

import { AddressSpotlight } from "../../components/payments/AddressSpotlight";
import { useSelectedProject } from "../../context/SelectedProjectContext";
import { fetchTransactionRequestControllerCreate } from "../../services/api/dev3Components";
import { Address } from "../../services/api/dev3Schemas";
import { nearWalletRegex } from "../../utils/near";

const CreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { project } = useSelectedProject();

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

  const handleSubmit = async ({ amount, receiver }: any) => {
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

      // await fetchTransactionRequestControllerCreate({
      //   body: {
      //     project_id: (project as any)._id,
      //     method: "ft_transfer",
      //     is_near_token: false,
      //     type: "Payment",
      //     args: {
      //       amount,
      //       receiver_id: receiver,
      //     },
      //     contractId: "dev-1667378639276-81893145684696",
      //   },
      // });

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

  const handleAddressSelect = (wallet: string) => {
    form.setFieldValue("receiver", wallet);
  };

  return (
    <Container>
      <Paper p="lg" w="100%" withBorder shadow="sm">
        <Stack>
          <small></small>
          <Title order={2}>Create payment request</Title>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              withAsterisk
              label="Receiver account id"
              description="The account to which the funds will be sent"
              placeholder="Enter receiver account id"
              rightSection={<AddressSpotlight onSelect={handleAddressSelect} />}
              {...form.getInputProps("receiver")}
            />

            <Checkbox
              mt="md"
              disabled
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

            <Group position="right" mt="md">
              <Button type="submit" variant="light" disabled={loading}>
                Create payment request
              </Button>
            </Group>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreatePayment;
