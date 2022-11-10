import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { NextLink } from "@mantine/next";
import { showNotification } from "@mantine/notifications";
import { Check, Copy, Plus, X } from "tabler-icons-react";
import {
  fetchAddressControllerRemove,
  useAddressControllerFindAll,
} from "../../services/api/dev3Components";
import { Address } from "../../services/api/dev3Schemas";

const AddressBook = () => {
  const { isLoading, refetch, data } = useAddressControllerFindAll({});

  const openDeleteModal = (address: Address) =>
    openConfirmModal({
      title: `Delete address '${address.alias}'?`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete address &apos;{address.alias}&apos;?
          This action is destructive and you can&apos;t take it back.
        </Text>
      ),
      labels: {
        confirm: `Delete address '${address.alias}'`,
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: async () => {
        try {
          const response = await fetchAddressControllerRemove({
            pathParams: {
              id: (address as any)._id,
            },
          });

          refetch();
        } catch (error) {
          showNotification({
            id: "loading-notification",
            color: "red",
            title: "Error while deleting the address",
            message:
              "There was an error adding deleting the address. Please try again later.",
            icon: <X size={16} />,
            autoClose: 3000,
          });
          console.error(error);
        }
      },
    });

  const rows = data?.results?.map((element) => (
    <tr key={element.createdAt}>
      <td>{element.alias}</td>
      <td>
        <Group>
          {element.wallet}
          <CopyButton value={element.wallet} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="bottom"
              >
                <ActionIcon
                  radius="xl"
                  variant="light"
                  color={copied ? "teal" : "primary"}
                  onClick={copy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </td>
      <td>
        {element.phone ? (
          <Group>
            {element.phone}
            <CopyButton value={element.phone} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="bottom"
                >
                  <ActionIcon
                    radius="xl"
                    variant="light"
                    color={copied ? "teal" : "primary"}
                    onClick={copy}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        ) : (
          "Not applicable"
        )}
      </td>
      <td>
        {element.email ? (
          <Group>
            {element.email}
            <CopyButton value={element.email} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="bottom"
                >
                  <ActionIcon
                    radius="xl"
                    variant="light"
                    color={copied ? "teal" : "primary"}
                    onClick={copy}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        ) : (
          "Not applicable"
        )}
      </td>
      <td>
        <Button
          variant="light"
          color="red"
          onClick={() => openDeleteModal(element)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <Stack align="flex-start">
      <Text size="xl" weight={500}>
        Addresses
      </Text>
      <Button
        sx={{ alignSelf: "self-end" }}
        component={NextLink}
        href="/address-book/create"
        variant="light"
        leftIcon={<Plus />}
      >
        Add new address
      </Button>
      <Paper sx={{ width: "100%" }} shadow="sm" p="md" withBorder>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Alias</th>
              <th>Wallet</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default AddressBook;
