import { Box, Button, Group, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Check, X } from "tabler-icons-react";
import { fetchAddressControllerCreate } from "../../../services/api/dev3Components";

interface AddressForm {
  alias: string;
  wallet: string;
  email: string;
  phone: string;
}

const CreateAddress = () => {
  const nearWalletRegex =
    /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<AddressForm>({
    validateInputOnChange: true,
    initialValues: {
      alias: "",
      wallet: "",
      email: "",
      phone: "",
    },

    validate: {
      wallet: (value) =>
        nearWalletRegex.test(value) ? null : "Invalid wallet address",
      alias: (value) => (value.length > 0 ? null : "Alias is required"),
      phone: (value) =>
        value === ""
          ? null
          : isValidPhoneNumber(value)
          ? null
          : "Invalid phone number",
      email: (value) =>
        value === ""
          ? null
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email address",
    },
  });

  const handleSubmit = async ({ alias, wallet, email, phone }: AddressForm) => {
    try {
      setLoading(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Adding a new address",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      const response = await fetchAddressControllerCreate({
        body: {
          alias,
          wallet,
          email: email === "" ? undefined : email,
          phone: phone === "" ? undefined : phone,
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "New address created!",
        message: "New address has been created. You can now use it.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      router.push(`/address-book`);
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error while adding address",
        message:
          "There was an error adding new address. Please try again later.",
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
        Add new address
      </Text>
      <Paper p="lg" sx={{ maxWidth: 600 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            withAsterisk
            label="Alias"
            description="Enter the alias for the account. Alias is a human readable description, through which you will be able to get the address."
            placeholder="Enter alias for account"
            {...form.getInputProps("alias")}
          />

          <TextInput
            mt="sm"
            withAsterisk
            label="Wallet address"
            description="Paste the wallet address you want to add to your address book"
            placeholder="Enter wallet address"
            {...form.getInputProps("wallet")}
          />

          <TextInput
            mt="sm"
            label="Email address (optional)"
            description="If you wish, you can add the email of the user."
            placeholder="Enter email address"
            type="email"
            {...form.getInputProps("email")}
          />

          <TextInput
            mt="sm"
            type="tel"
            label="Phone (optional)"
            description="If you wish, you can add the phone number of the user."
            placeholder="Enter phone number"
            {...form.getInputProps("phone")}
          />

          <Group position="right" mt="md">
            <Button type="submit" variant="light" disabled={loading}>
              Add address
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAddress;
