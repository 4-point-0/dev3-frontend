import { ActionIcon, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { NextLink } from "@mantine/next";
import { showNotification } from "@mantine/notifications";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useState } from "react";
import { Edit, Plus, Trash, X } from "tabler-icons-react";

import { CopyCell } from "../../components/table/CopyCell";
import {
  fetchAddressControllerRemove,
  useAddressControllerFindAll,
} from "../../services/api/dev3Components";
import { Address } from "../../services/api/dev3Schemas";

const PAGE_LIMIT = 20;

const AddressBook = () => {
  const [page, setPage] = useState(1);

  const { isFetching, refetch, data } = useAddressControllerFindAll(
    {
      queryParams: {
        offset: (page - 1) * PAGE_LIMIT,
        limit: PAGE_LIMIT,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleDelete = (address: Address) =>
    openConfirmModal({
      title: `Delete address '${address.alias}'?`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete address &apos;
          {address.alias}&apos;? This action is destructive and you can&apos;t
          take it back.
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
          await fetchAddressControllerRemove({
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

  const columns: Array<DataTableColumn<Address>> = [
    {
      accessor: "alias",
    },
    {
      accessor: "wallet",
      render: ({ wallet }) => {
        return <CopyCell value={wallet} />;
      },
    },
    {
      accessor: "phone",
      render: ({ phone }) => {
        return <CopyCell value={phone} />;
      },
    },
    {
      accessor: "email",
      render: ({ email }) => {
        return <CopyCell value={email} />;
      },
    },
    {
      accessor: "actions",
      render: (address) => {
        return (
          <Group spacing={4} noWrap>
            <ActionIcon
              component={NextLink}
              href="/address-book/[id]/edit"
              as={`/address-book/${(address as any)._id}/edit`}
              color="blue"
            >
              <Edit size={16} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => handleDelete(address)}>
              <Trash size={16} />
            </ActionIcon>
          </Group>
        );
      },
    },
  ];

  const paginationProps =
    (data?.total ?? -1) < PAGE_LIMIT
      ? {}
      : {
          totalRecords: data?.total,
          recordsPerPage: PAGE_LIMIT,
          onPageChange: setPage,
          page,
        };

  console.log(data?.total ?? 0 < PAGE_LIMIT, paginationProps);

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
        <DataTable
          highlightOnHover
          idAccessor="alias"
          columns={columns}
          records={data?.results}
          fetching={isFetching}
          {...paginationProps}
        ></DataTable>
      </Paper>
    </Stack>
  );
};

export default AddressBook;
