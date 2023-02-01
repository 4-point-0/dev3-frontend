import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Trash } from "tabler-icons-react";

import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { usePaginationProps } from "../../../hooks/usePaginationProps";
import { useDeployedContractControllerFindAll } from "../../../services/api/dev3Components";
import { DeployedContract } from "../../../services/api/dev3Schemas";
import { AddressCell } from "../../table/AddressCell";
import { CopyCell } from "../../table/CopyCell";

const PAGE_LIMIT = 20;

export const DeployedContracts = () => {
  const [page, setPage] = useState(1);
  const { projectId } = useSelectedProject();
  const router = useRouter();

  const { data, isLoading } = useDeployedContractControllerFindAll({
    queryParams: {
      project_id: projectId,
      status: "Deployed",
      offset: (page - 1) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
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
      accessor: "tags",
      render: ({ tags }) => {
        return (
          <Group spacing={4}>
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Group>
        );
      },
    },
    {
      accessor: "address",
      render: ({ alias }) => {
        return <AddressCell alias={alias} />;
      },
    },

    {
      accessor: "actions",
      render: () => {
        return (
          <Group>
            <Tooltip label="Delete" position="bottom" withArrow>
              <ActionIcon
                color="red"
                radius="xl"
                variant="light"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    },
  ];

  const handleRowClick = (contract: DeployedContract) => {
    router.push(`/contracts/${contract.uuid}`);
  };

  return (
    <DataTable
      minHeight={164}
      idAccessor="_id"
      columns={columns}
      noRecordsText="No deployed contracts"
      records={data?.results}
      fetching={isLoading}
      onRowClick={handleRowClick}
      highlightOnHover
      {...paginationProps}
    />
  );
};
