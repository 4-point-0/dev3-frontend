import { ActionIcon, Badge, Button, Group, Text, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { ExternalLink, Plus, Share } from "tabler-icons-react";
import { PageContainer } from "../../components/layout/PageContainer";
import showShareModal from "../../components/ShareModal";
import { CopyCell } from "../../components/table/CopyCell";
import { TransactionStatus } from "../../components/transactions/Status";

import { useTransactionRequestControllerFindAll } from "../../services/api/dev3Components";
import { TransactionRequest } from "../../services/api/dev3Schemas";

const Payments = () => {
  const { isLoading, data } = useTransactionRequestControllerFindAll({
    queryParams: {
      type: "Payment",
    },
  });

  const columns: Array<DataTableColumn<TransactionRequest>> = [
    {
      accessor: "createdAt",
      render: ({ createdAt }) => {
        const formatedDate = new Intl.DateTimeFormat("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(createdAt));

        return <Text>{formatedDate}</Text>;
      },
    },
    {
      accessor: "amount",
      render: ({ args, is_near_token, meta }) => {
        let amount = "Unknown";

        try {
          const parsedArgs = JSON.parse(args);

          amount = is_near_token
            ? formatNearAmount(parsedArgs?.["request"]?.["amount"] as string)
            : parsedArgs?.["amount"];

          const parsedMeta = meta ? JSON.parse(meta) : null;

          if (parsedMeta?.decimals) {
            amount = (parseInt(amount) / 10 ** parsedMeta.decimals).toString();
          }
        } catch {
          amount = "Couldn't parse amount";
        }

        return <Text>{amount}</Text>;
      },
    },
    {
      accessor: "token",
      render: ({ is_near_token, meta }) => {
        const parsedMeta = JSON.parse(meta || "null");

        return (
          <Badge>
            {is_near_token ? "NEAR" : parsedMeta?.name ?? "Unknown"}
          </Badge>
        );
      },
    },
    {
      accessor: "status",
      render: ({ status }) => <TransactionStatus status={status} />,
    },
    {
      accessor: "actions",
      render: ({ uuid }) => {
        const url = `${window.location.origin}/action/payment/${uuid}`;

        const handleShare = (url: string) => {
          return () => {
            showShareModal({
              url,
              title: "Share the payment request:",
            });
          };
        };

        return (
          <CopyCell value={url}>
            <Group>
              <Tooltip position="bottom" label="Open" withArrow>
                <ActionIcon
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="xl"
                  variant="light"
                  color="blue"
                >
                  <ExternalLink size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip position="bottom" label="Share" withArrow>
                <ActionIcon
                  radius="xl"
                  variant="light"
                  color="blue"
                  onClick={handleShare(url)}
                >
                  <Share size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </CopyCell>
        );
      },
    },
  ];

  return (
    <PageContainer title="Payment Requests" containerProps={{ fluid: true }}>
      <Button
        sx={{ alignSelf: "self-end" }}
        component={NextLink}
        href="/payments/create"
        variant="light"
        leftIcon={<Plus />}
      >
        Create payment request
      </Button>

      <DataTable
        minHeight={164}
        idAccessor="_id"
        columns={columns}
        noRecordsText="No payment requests"
        records={data?.results}
        fetching={isLoading}
      />
    </PageContainer>
  );
};

export default Payments;
