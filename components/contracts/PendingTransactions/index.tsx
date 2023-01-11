import { ActionIcon, Badge, Button, Group, Text, Tooltip } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useState } from "react";
import { ExternalLink, Trash } from "tabler-icons-react";

import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { usePaginationProps } from "../../../hooks/usePaginationProps";
import { useDeployedContractControllerFindAll } from "../../../services/api/dev3Components";
import { DeployedContract } from "../../../services/api/dev3Schemas";
import { CopyCell } from "../../table/CopyCell";

const PAGE_LIMIT = 20;

export const PendingTransactions = () => {
  const [page, setPage] = useState(1);
  const { projectId } = useSelectedProject();

  const { data, isLoading } = useDeployedContractControllerFindAll({
    queryParams: {
      project_id: projectId ?? undefined,
      status: "Pending",
    },
  });

  const paginationProps = usePaginationProps({
    page,
    onPageChange: setPage,
    limit: PAGE_LIMIT,
    total: data?.total,
  });

  const columns: Array<DataTableColumn<DeployedContract>> = [
    {
      accessor: "alias",
    },
    {
      accessor: "type",
      render: ({ contract_template }) => {
        return <Text>{contract_template?.name}</Text>;
      },
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => {
        const formatedDate = new Intl.DateTimeFormat("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(createdAt));

        return <Text>{formatedDate}</Text>;
      },
    },

    {
      accessor: "actions",
      render: () => {
        return (
          <Group>
            <Tooltip label="Delete" position="bottom" withArrow>
              <ActionIcon
                component="a"
                href={""}
                target="_blank"
                rel="noopener noreferrer"
                radius="xl"
                variant="light"
                color="blue"
              >
                <ExternalLink size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    },
  ];

  return (
    <DataTable
      minHeight={164}
      idAccessor="_id"
      columns={columns}
      noRecordsText="No pending transactions"
      records={data?.results}
      fetching={isLoading}
      {...paginationProps}
    />
  );
};
