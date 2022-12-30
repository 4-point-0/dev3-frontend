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
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Check, X } from "tabler-icons-react";
import { PageContainer } from "../../components/layout/PageContainer";

import { AddressSpotlight } from "../../components/payments/AddressSpotlight";
import { useSelectedProject } from "../../context/SelectedProjectContext";
import { useWalletSelector } from "../../context/WalletSelectorContext";
import { fetchTransactionRequestControllerCreate } from "../../services/api/dev3Components";
import { Address } from "../../services/api/dev3Schemas";
import {
  nearWalletRegex,
  NEAR_CONTRACT_ID,
  parseFtAmount,
} from "../../utils/near";

interface IPaymentFormValues {
  amount: number;
  receiver: string;
  contractId: string;
  isFungibleToken: boolean;
}

class ReceiverError extends Error {}

const CreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { project } = useSelectedProject();
  const { viewMethod } = useWalletSelector();

  const form = useForm<IPaymentFormValues>({
    validateInputOnChange: true,
    initialValues: {
      amount: 0,
      receiver: "",
      contractId: "",
      isFungibleToken: false,
    },

    validate: {
      receiver: (value) =>
        nearWalletRegex.test(value) ? null : "Invalid reciver address",
      contractId: (value, values) =>
        !values.isFungibleToken
          ? null
          : nearWalletRegex.test(value)
          ? null
          : "Invalid fungible token address",
      amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
    },
  });

  const validateReceiver = useCallback(
    async (contractId: string, receiver: string) => {
      return await viewMethod(contractId, "storage_balance_of", {
        account_id: receiver,
      });
    },
    [viewMethod]
  );

  const handleSubmit = async ({
    amount,
    isFungibleToken,
    contractId,
    receiver,
  }: IPaymentFormValues) => {
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

      let args;
      let method = isFungibleToken ? "ft_transfer" : "transfer_funds";
      let deposit = "1";

      if (
        isFungibleToken &&
        contractId &&
        (await validateReceiver(contractId, receiver)) === null
      ) {
        throw new ReceiverError();
      }

      if (!isFungibleToken) {
        const parsedAmount = parseNearAmount(amount.toString());
        deposit = parsedAmount as string;

        args = {
          request: {
            receiver_account_id: receiver,
            amount: parsedAmount,
          },
        };
      } else {
        const metadata = await viewMethod(contractId, "ft_metadata", null);
        const decimals = metadata?.["decimals"] ?? 0;

        const parsedAmount = parseFtAmount(amount, decimals);
        console.log(decimals, parseFtAmount);

        args = {
          amount: parsedAmount,
          receiver_id: receiver,
        };
      }

      await fetchTransactionRequestControllerCreate({
        body: {
          project_id: (project as any)._id,
          method,
          is_near_token: !isFungibleToken,
          type: "Payment",
          args,
          contractId: isFungibleToken ? contractId : NEAR_CONTRACT_ID,
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
      let title = "Error creating payment request";
      let message =
        "There was an error creating your payment request. Please try again later.";

      if (error instanceof ReceiverError) {
        title = "Recipient is not registered to receive fungible tokens";
        message =
          "Please ask the recipient to register to receive fungible tokens";
      }

      updateNotification({
        id: "loading-notification",
        color: "red",
        title,
        message,
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
    <PageContainer title="Create payment request">
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
          label="Do you wish to receive fungible token instead of NEAR?"
          {...form.getInputProps("isFungibleToken", { type: "checkbox" })}
        />

        {form.values.isFungibleToken && (
          <TextInput
            mt="sm"
            label="Fungible token contract"
            placeholder="Enter fungible token contract id"
            {...form.getInputProps("contractId")}
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
    </PageContainer>
  );
};

export default CreatePayment;
