import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { NextLink } from "@mantine/next";
import { showNotification } from "@mantine/notifications";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { Edit, Plus, Trash, X } from "tabler-icons-react";

import { CopyCell } from "../../components/table/CopyCell";
import {
  fetchAddressControllerRemove,
  useAddressControllerFindAll,
} from "../../services/api/dev3Components";
import { Address } from "../../services/api/dev3Schemas";

const PAGE_LIMIT = 20;

const AddressBook = () => {
  const router = useRouter();
  console.log(router.asPath);

  const page = useMemo(() => {
    if (!router.query.page) {
      return 1;
    }

    return parseInt(router.query.page as string);
  }, [router.query?.page]);

  const { isLoading, refetch, data } = useAddressControllerFindAll({
    queryParams: {
      offset: (page - 1) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
    },
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(
        {
          pathname: router.pathname,
          query: { page: newPage },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
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
    (data?.total || 0) <= PAGE_LIMIT
      ? {}
      : {
          totalRecords: data?.total,
          recordsPerPage: PAGE_LIMIT,
          onPageChange: handlePageChange,
          page,
        };

  return (
    <Container fluid>
      <Paper w="100%" shadow="sm" p="md" withBorder>
        <Stack>
          <Title order={2}>Address Book</Title>

          <Button
            sx={{ alignSelf: "self-end" }}
            component={NextLink}
            href="/address-book/create"
            variant="light"
            leftIcon={<Plus />}
          >
            Add new address
          </Button>

          <DataTable
            highlightOnHover
            idAccessor="alias"
            minHeight={164}
            columns={columns}
            records={data?.results}
            fetching={isLoading}
            noRecordsText="No addresses"
            {...paginationProps}
          ></DataTable>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AddressBook;
