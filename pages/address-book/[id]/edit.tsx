import {
  Box,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Check, X } from "tabler-icons-react";

import {
  AccountForm,
  IAddressFormValues,
} from "../../../components/address-book/AddressForm";
import {
  fetchAddressControllerUpdate,
  useAddressControllerFindOne,
} from "../../../services/api/dev3Components";

export const EditAddress = () => {
  const router = useRouter();
  const id = useMemo(() => {
    return String(router.query.id);
  }, [router.query.id]);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useAddressControllerFindOne({
    pathParams: {
      id,
    },
  });

  const handleSubmit = async ({ email, phone }: IAddressFormValues) => {
    setIsEditing(true);

    try {
      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Editing the address",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      await fetchAddressControllerUpdate({
        pathParams: { id },
        body: {
          email: (email || null) as any,
          phone: (phone || null) as any,
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "Address edited!",
        message: "The address was successfully edited.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      router.push(`/address-book`);
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error while editing address",
        message:
          "There was an error editing the address. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <Container>
      <Paper p="lg" withBorder shadow="sm">
        <Stack spacing="md">
          <Title order={2}>Edit address information</Title>
          {isLoading && (
            <Flex mih={412} align="center" justify="center">
              <Loader size="lg" />
            </Flex>
          )}
          {data && (
            <AccountForm
              isEdit
              disabled={isEditing}
              handleSubmit={handleSubmit}
              initialValues={data}
            />
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditAddress;
